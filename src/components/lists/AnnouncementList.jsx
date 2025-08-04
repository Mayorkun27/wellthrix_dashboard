import React from 'react'

const AnnouncementList = ({info, createdAt, action}) => {
    return (
        <div onClick={action} className='py-1.5 px-0.5 last:border-b-0 border-b border-black/50 flex items-center justify-between cursor-pointer group hover:bg-pryClr/5'>
            <span className='md:text-sm text-sm md:w-4/5 w-3/4 line-clamp-1'>{info}</span>
            <span className='group-hover:hidden text-[8px]'>{createdAt}</span>
            <span className='hidden group-hover:inline-block text-[8px]'>View</span>
        </div>
    )
}

export default AnnouncementList