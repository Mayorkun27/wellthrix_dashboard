import React, { useEffect, useState, useCallback } from "react";
import Modal from "./modals/Modal";
import AnnouncementList from "./lists/AnnouncementList";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { formatISODateToCustom } from "../utilities/formatterutility";

const API_URL = import.meta.env.VITE_API_BASE_URL
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL

const READ_ANNOUNCEMENTS_KEY = 'readAnnouncements';

const AnnouncementBoard = ({ refresh }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [selectedAnnouncementAttachment, setSelectedAnnouncementAttachment] = useState(null);
    const [popupAnnouncement, setPopupAnnouncement] = useState(null);

    const { token, logout, user } = useUser();

    const getReadAnnouncementIds = () => {
        try {
            const storedIds = localStorage.getItem(READ_ANNOUNCEMENTS_KEY);
            return storedIds ? new Set(JSON.parse(storedIds)) : new Set();
        } catch (e) {
            console.error("Could not read from local storage", e);
            return new Set();
        }
    };

    const markAnnouncementAsRead = useCallback((announcementId) => {
        const readIds = getReadAnnouncementIds();
        if (!readIds.has(announcementId)) {
            readIds.add(announcementId);
            try {
                localStorage.setItem(READ_ANNOUNCEMENTS_KEY, JSON.stringify(Array.from(readIds)));
            } catch (e) {
                console.error("Could not write to local storage", e);
            }
        }
    }, []);

    const findUnreadAnnouncement = (allAnnouncements) => {
        const readIds = getReadAnnouncementIds();
        
        const sortedAnnouncements = [...allAnnouncements].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
        );

        const unreadAnnouncement = sortedAnnouncements.find(announcement => 
            !readIds.has(String(announcement.id))
        );

        return unreadAnnouncement || null;
    };

    const fetchAnnouncements = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/announcements`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            console.log("announcement fetch response", response);

            if (response.status === 200 && response.data.status === "success") {
                const fetchedAnnouncements = response.data.data.data || [];
                setAnnouncements(fetchedAnnouncements);
                
                const latestUnread = findUnreadAnnouncement(fetchedAnnouncements);
                if (latestUnread && user?.role !== "admin") {
                    setPopupAnnouncement(latestUnread);
                }
            }
        } catch (error) {
            if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
                logout();
            }
            console.error("An error occured fetching announcements", error);
            toast.error(error.response.data.message || "An error occured fetching announcements");
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    }, [token, refresh, logout]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handlePopupClose = () => {
        if (popupAnnouncement) {
            markAnnouncementAsRead(String(popupAnnouncement.id));
        }
        setPopupAnnouncement(null);
    };

    const handleAnnouncementDeletion = useCallback(async (id) => {
        setIsDeleting(true);
        try {
            const response = await axios.delete(`${API_URL}/api/announcements/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            console.log("announcement delete response", response);

            if (response.status === 200) {
                const readIds = getReadAnnouncementIds();
                readIds.delete(String(id));
                localStorage.setItem(READ_ANNOUNCEMENTS_KEY, JSON.stringify(Array.from(readIds)));
                
                setAnnouncements(prevAnnouncements => prevAnnouncements.filter(announcement => announcement.id !== id));
                setSelectedAnnouncement(null);
                toast.success(response.data.message || "Announcement deleted successfully");
            }
        } catch (error) {
            if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
                logout();
            }
            console.log("An error occured deleting announcements", error);
            toast.error(error.response.data.message || "An error occured deleting announcements");
        } finally {
            setTimeout(() => {
                setIsDeleting(false);
            }, 2000);
        }
    }, [token, logout]);

    return (
        <>
            <div className="h-full">
                {
                    isLoading ? (
                        <div className="h-[20vh] flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-accClr border-t-transparent mx-auto rounded-full animate-spin"></div>
                        </div>
                    ) : announcements.length <= 0 && !isLoading ? (
                        <div className="h-[7vh] flex items-center justify-center">
                            <h3>You are all caught up!.</h3>
                        </div>
                    ) : (
                        announcements.map((announcement, index) => (
                            <AnnouncementList
                                key={announcement.id + " " + index}
                                {...announcement}
                                action={() => {
                                    setSelectedAnnouncement(announcement);
                                    markAnnouncementAsRead(String(announcement.id));
                                }}
                            />
                        ))
                    )
                }
            </div>

            {popupAnnouncement && (
                <Modal onClose={handlePopupClose}>
                    <div className="w-full">
                        <h3 className="text-2xl font-bold mb-2 text-pryClr">New Announcement!</h3>
                        <h4 className="md:text-xl text-lg font-semibold tracking-tighter mb-4">
                            {popupAnnouncement.title}
                        </h4>
                        <p className="font-medium whitespace-pre-wrap">{popupAnnouncement.message}</p>
                        
                        <div className="flex items-center justify-between mt-4">
                            {true && (
                                <small
                                    className="underline text-center cursor-pointer"
                                    onClick={() => {
                                        setSelectedAnnouncementAttachment(popupAnnouncement);
                                        handlePopupClose();
                                    }}
                                >
                                    View Attachment
                                </small>
                            )}
                            <p className="text-end text-sm text-black/50">
                                {formatISODateToCustom(popupAnnouncement.created_at)}
                            </p>
                        </div>
                        <div className="text-center mt-6">
                            <button
                                type="button"
                                onClick={handlePopupClose}
                                className="bg-pryClr md:w-1/2 w-full h-[50px] text-white rounded-lg cursor-pointer mx-auto"
                            >
                                Got it! (Mark as Read)
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {selectedAnnouncement && (
                <Modal onClose={() => setSelectedAnnouncement(null)}>
                    <div className="w-full">
                        <h3 className="md:text-2xl text-xl font-bold tracking-tighter mb-4">
                            {selectedAnnouncement.title}
                        </h3>
                        <p className="font-medium whitespace-pre-wrap">{selectedAnnouncement.message}</p>
                        <div className="flex items-center justify-between mt-4">
                            {true && (
                                <small
                                    className="underline text-center cursor-pointer"
                                    onClick={() => {
                                        setSelectedAnnouncementAttachment(selectedAnnouncement)
                                        setSelectedAnnouncement(null)
                                    }}
                                >
                                    View Attachment
                                </small>)}
                            <p className="text-end mt-3 text-sm text-black/50">
                                Date posted: {formatISODateToCustom(selectedAnnouncement.created_at)}
                            </p>
                        </div>
                        {
                            user?.role === "admin" && (
                                <div className="text-center mt-6">
                                    <button
                                        type="button"
                                        disabled={isDeleting || isLoading}
                                        onClick={() => handleAnnouncementDeletion(selectedAnnouncement.id)}
                                        className="bg-pryClr md:w-1/2 w-full h-[50px] text-secClr rounded-lg cursor-pointer mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isDeleting ? "Deleting announcement..." : "Delete Announcement"}
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </Modal>
            )}

            {selectedAnnouncementAttachment && (
                <Modal onClose={() => setSelectedAnnouncementAttachment(null)}>
                    <div className="w-full">
                        <img src={`${IMAGE_BASE_URL}/${selectedAnnouncementAttachment?.image}`} alt="..." className="lg:w-1/2 md:w-3/4 mx-auto" />
                    </div>
                </Modal>
            )}
        </>
    );
};

export default AnnouncementBoard;
