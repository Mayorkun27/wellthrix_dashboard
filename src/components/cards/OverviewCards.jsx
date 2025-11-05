import React from 'react'
import { formatterUtility } from '../../utilities/formatterutility'
import { MdOutlineArrowOutward } from 'react-icons/md'
import { Link } from 'react-router-dom'

const OverviewCards = ({ walletType, amount, isAmount=true, icon, buttonText, buttonType, path, bgType=1 }) => {
  return (
    <Link to={path} className={`${bgType === 1 ? "bg-pryClr text-secClr" : "bg-accClr text-black"} p-4 rounded-lg flex items-center border-red-500 gap-2 shadow-md`}>
      <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
        {icon}
      </div>
      <div className="flex flex-col gap-1 w-[calc(100%-40px)]">
        <div className="flex items-center justify-between w-full">
          <small className="lg:text-[10px] text-xs">{walletType}</small>
          <small className="flex items-center gap-1 text-[8px] hover:underline underline-offset-1 transition-all duration-500 text-secClr/70">
            {buttonText}
            {buttonText && <MdOutlineArrowOutward />}
          </small>
        </div>
        {isAmount && <h4 className='text-xl font-bold'>{formatterUtility(Number(amount))}</h4>}
        {!isAmount && <h4 className='text-xl font-bold'>{amount}</h4>}
      </div>
    </Link>
  )
}

export default OverviewCards