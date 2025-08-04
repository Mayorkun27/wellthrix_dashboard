import React from 'react'

const ListTwo = ({ type=1, position, identifier, point}) => {
  return (
    <div className={`flex items-center justify-between border-b border-black/20 pb-2 last:border-b-0`}>
        <div className="flex items-center md:gap-4 gap-2">
            <div className={`w-[35px] h-[35px] rounded-full ${type === 2 ? "bg-accClr/30" : "bg-pryClr/30"} overflow-hidden flex items-center justify-center font-semibold text-black`}>
                <h3 className=''>{position}</h3>
            </div>
            <h3 className='font-medium text-black/80 text-sm'>{identifier}</h3>
        </div>
        <span className='font-semibold text-sm'>{point}</span>
    </div>
  )
}

export default ListTwo