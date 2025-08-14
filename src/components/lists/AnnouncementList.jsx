import React from 'react'
import { formatISODateToCustom } from '../../utilities/Formatterutility'

const AnnouncementList = ({title, created_at, action}) => {
    return (
        <div onClick={action} className='w-full py-1.5 px-0.5 last:border-b-0 border-b border-black/50 flex items-center justify-between cursor-pointer group hover:bg-pryClr/5'>
            <span className='md:text-sm text-sm md:w-4/5 w-3/4 line-clamp-1 md:font-medium font-semibold'>{title}</span>
            <span className='group-hover:hidden text-[8px]'>{formatISODateToCustom(created_at).split(" ")[0]}</span>
            <span className='hidden group-focus:inline-block group-hover:inline-block text-[8px] px-2'>View</span>
        </div>
    )
}

export default AnnouncementList