import React from 'react'
import { Link } from 'react-router-dom'

const ReferralCards = ({ name, userName, createdAt }) => {

    const splittedName = name?.split(" ");
    const splittedFirstName = splittedName[0].split("")[0]
    const splittedLastName = splittedName[1].split("")[0]

  return (
    <div className='flex items-end justify-between'>
        <div className="flex items-center md:gap-4 gap-2">
            <div className="w-[40px] h-[40px] rounded-full border border-pryClr bg-pryClr overflow-hidden flex items-center justify-center font-medium text-secClr">
                <h3 className=''>{splittedFirstName+splittedLastName}</h3>
            </div>
            <div className="flex flex-col md:leading-0 leading-3">
                <h3 className='font-semibold text-sm'>{name}</h3>
                <small className='text-xs text-black/50'>{userName}</small>
            </div>
        </div>
        <span className='text-[8px]'>{createdAt}</span>
    </div>
  )
}

export default ReferralCards