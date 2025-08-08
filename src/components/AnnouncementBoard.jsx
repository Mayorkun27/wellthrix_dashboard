import React, { useEffect, useState } from "react";
import Modal from "./modals/Modal";
import AnnouncementList from "./lists/AnnouncementList";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { formatISODateToCustom } from "../utilities/Formatterutility";

const API_URL = import.meta.env.VITE_API_BASE_URL

const AnnouncementBoard = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    const { token, logout, user } = useUser();

    const fetchAnnouncements = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_URL}/api/announcements`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            })

            console.log("announcement fetch response", response)

            if (response.status === 200 && response.data.status === "success") {
                setAnnouncements(response.data.data.data)
            }
        } catch (error) {
            if (error.response.data.message.toLowerCase() == "unauthenticated") {
                logout()
            }
            console.error("An error occured fetching announcements", error)
            toast.error(error.response.data.message || "An error occured fetching announcements")
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 2000);
        }
    }

    useEffect(() => {
        fetchAnnouncements()
    }, [token])

    const handleAnnouncementDeletion = async (id) => {
        setIsDeleting(true)
        try {
            const response = await axios.delete(`${API_URL}/api/announcements/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })

            console.log("announcement delete response", response)

            if (response.status === 200) {
                setAnnouncements(prevAnnouncements => prevAnnouncements.filter(announcement => announcement.id !== id));
                setSelectedAnnouncement(null);
                toast.success(response.data.message || "Announcement deleted successfully")
            }
        } catch (error) {
            if (error.response.data.message.toLowerCase() == "unauthenticated") {
                logout()
            }
            console.log("An error occured deleting announcements", error)
            toast.error(error.response.data.message || "An error occured deleting announcements")
        } finally {
            setTimeout(() => {
                setIsDeleting(false)
            }, 2000);
        }
    }

    return (
        <div>
            <div className="h-full">
                {
                    announcements.length <= 0 ? (
                        <>
                            <h3>No announcement found</h3>
                        </>
                    ) : (
                        announcements.map((announcement, index) => (
                            <AnnouncementList
                                key={announcement.id + " " + index}
                                {...announcement}
                                action={() => setSelectedAnnouncement(announcement)}
                            />
                        ))
                    )
                }
            </div>
            {selectedAnnouncement && (
                <Modal onClose={() => setSelectedAnnouncement(null)}>
                    <div className="w-full">
                        <h3 className="md:text-2xl text-xl font-bold tracking-tighter mb-4">
                            {selectedAnnouncement.title}
                        </h3>
                        <p className="font-medium">{selectedAnnouncement.message}</p>
                        <p className="text-end mt-3 text-sm text-black/50">
                            Date posted: {formatISODateToCustom(selectedAnnouncement.created_at)}
                        </p>
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
        </div>
    );
};

export default AnnouncementBoard;
