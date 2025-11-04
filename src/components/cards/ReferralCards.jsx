import React from 'react'
import { formatDateToStyle, formatISODateToCustom } from '../../utilities/formatterutility';

const ReferralCards = ({ user }) => {

    const splittedName = user?.fullname?.split(" ");
    const splittedFirstName = splittedName[0].split("")[0]
    const splittedLastName = splittedName[1].split("")[0]

  return (
    <div className='flex items-end justify-between'>
        <div className="flex items-center md:gap-3 gap-2 w-3/4">
            <div className="size-[40px] rounded-full border border-pryClr bg-pryClr overflow-hidden flex items-center justify-center font-medium text-secClr">
                <h3 className='uppercase'>{`${splittedFirstName}${splittedLastName}`}</h3>
            </div>
            <div className="flex flex-col md:leading-0 leading-3 w-[calc(100%-40px-12px)]">
                <h3 className='font-semibold text-sm line-clamp-1'>{user?.fullname}</h3>
                <small className='text-xs text-black/50'>&#64;{user?.username}</small>
            </div>
        </div>
        <span className='text-[8px] whitespace-nowrap -mt-2'>{formatDateToStyle(user?.created_at)}</span>
    </div>
  )
}

export default ReferralCards