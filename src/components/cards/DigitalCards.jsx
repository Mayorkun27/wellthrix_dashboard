import React from 'react'
import { Link } from 'react-router-dom'

const DigitalCards = ({ icon, item, path }) => {
  return (
    <Link to={path} className='w-full bg-pryClr/20 group-hover:bg-pryClr/30 p-4 flex flex-col items-center gap-4'>
      <span className='text-4xl text-pryClr'>{icon}</span>
      <h6>{item}</h6>
    </Link>
  )
}

export default DigitalCards