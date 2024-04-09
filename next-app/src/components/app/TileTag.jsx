import React from 'react'
import { FaAnglesUp, FaAnglesDown, FaAngleUp, FaAngleDown, FaLock, FaDice, FaPlus, FaMinus } from "react-icons/fa6";
import { GiHaunting } from "react-icons/gi";
import { TbPigMoney } from "react-icons/tb";
import { RiGhostLine } from "react-icons/ri";


function TileTag({tile, className}) {
if(tile.type === 'amp') return
  const getIcon = () =>{
    let type = tile.tagType
    let tier = tile.tier
    if(type === 'increase'){
      if(tier === 1) return <FaAnglesUp className='text-green-500'/>
      if(tier === 2) return <FaAngleUp className='text-green-500'/>
    }

    if(type === 'decrease'){
      if(tier === 1) return <FaAnglesDown className='text-red-500'/>
      if(tier === 2) return <FaAngleDown className='text-red-500'/>
    }

    if(type === 'guaranteed') return <FaLock/>

    if(type === 'reroll') return <FaDice/>

    if(type === 'haunted') return <GiHaunting/>

    if(type === 'save') return <TbPigMoney/>
    if(type === '+1') return <FaPlus className='text-green-500'/>
    if(type === '-1') return <FaMinus className='text-red-500'/>
    if(type === 'haunt') return <RiGhostLine/>
    return ''
  }

  return (
    <div className={`flex items-center ${className}`}>
      {getIcon()}
    </div>
  )
}

export default TileTag