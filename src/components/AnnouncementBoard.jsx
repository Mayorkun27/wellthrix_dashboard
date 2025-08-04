import React, { useState } from 'react'
import Modal from './modals/Modal'
import AnnouncementList from './lists/AnnouncementList'

const AnnouncementBoard = () => {

    const [selectedAnnouncement, setSelectedAnnouncement] = useState("")

    const announcementBoard = [
        {
            info: "lorem ipsum dolor sit amet consecteur apidiscicing elit",
            createdAt: "25 July, 2025"
        },
        {
            info: "lorem ipsum dolor sit amet consecteur apidiscicing elit",
            createdAt: "25 July, 2025"
        },
        {
            info: "lorem ipsum dolor sit amet consecteur apidiscicing elit",
            createdAt: "25 July, 2025"
        },
        {
            info: "lorem ipsum dolor sit amet consecteur apidiscicing elit",
            createdAt: "25 July, 2025"
        },
        {
            info: "lorem ipsum dolor sit amet consecteur apidiscicing elit",
            createdAt: "25 July, 2025"
        },
        {
            info: "lorem ipsum dolor sit amet consecteur apidiscicing elit",
            createdAt: "25 July, 2025"
        },
    ]

    return (
        <div>
            <div className='h-[20vh] overflow-y-scroll pe-2 styled-scrollbar'>
                {
                    announcementBoard.map((announcement, index) => (
                        <AnnouncementList key={index} {...announcement} action={() => setSelectedAnnouncement(announcement)} />
                    ))
                }
            </div>
            {
                selectedAnnouncement && (
                    <Modal
                        onClose={() => setSelectedAnnouncement("")}
                    >
                        <div className='w-full'>
                            <h3 className='md:text-2xl text-xl font-bold tracking-tighter mb-4'>Announcement</h3>
                            <p className='font-medium'>{selectedAnnouncement.info}</p>
                            <p className='text-end mt-3 text-sm text-black/50'>Date posted: {selectedAnnouncement.createdAt}</p>
                        </div>
                    </Modal>
                )
            }
        </div>
    )
}

export default AnnouncementBoard