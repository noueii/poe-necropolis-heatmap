import React from 'react'
import TileTag from './TileTag'
import { FaAnglesUp, FaAnglesDown, FaAngleUp, FaAngleDown, FaLock, FaDice, FaPlus, FaMinus } from "react-icons/fa6";
import { GiHaunting } from "react-icons/gi";
import { TbPigMoney } from "react-icons/tb";

function TileTextDisplay({tile, value, size, type, className}) {

  if(!tile) return

  const isIncrease = tile?.tagType === 'increase'
  const isDecrease = tile?.tagType === 'decrease'
  let displayText = tile.text.replace('[value]',value)
  displayText = displayText.split('[craft]')

  if(tile.text === 'Armour Items have a Strength Requirement') console.log(displayText)

  let textSize = getTextSize()

  function getTextSize(){
    switch(size){
      case 'sm': return 'text-sm'
      case 'xs': return 'text-xs'
      case 'lg': return 'text-lg'
      case '2xl': return 'text-2xl'
      case 'xl': return 'text-xl'
      default: return ''
    }
  }

  const getCraftColor = () =>{
    let type = tile.craft.toLowerCase()
    switch(type){
      case 'physical': return "text-physical"
      case 'fire': return 'text-fire'
      case 'cold': return 'text-cold'
      case 'lightning': return 'text-lightning'
      case 'chaos': return 'text-chaos'
      case 'life': return 'text-life'
      case 'mana': return 'text-mana'
      case 'attack': return 'text-attack'
      case 'caster': return 'text-caster'
      case 'elemental': return 'text-elemental'
      case 'defence': return 'text-defence'
      case 'critical': return 'text-critical'
      case 'speed': return 'text-speed'
      case 'attribute': return 'text-attribute'
      case 'resistance': return 'text-resistance'
      case 'gem': return 'text-gem'
      case 'minion': return 'text-minion'
      default: return ''
    }
    return ''
  }



  const getIcon = () =>{
    let type = tile.tagType
    if(type === 'increase') return <FaAnglesUp className='text-green-500'/>

    

    if(type === 'decrease')  return <FaAnglesDown className='text-red-500'/>
    

    if(type === 'guaranteed') return <FaLock/>

    if(type === 'reroll') return <FaDice/>

    if(type === 'haunted') return <GiHaunting/>

    if(type === 'save') return <TbPigMoney/>
    if(type === 'add') return <FaPlus className='text-green-500'/>
    if(type === 'minus') return <FaMinus className='text-red-500'/>
    return ''
  }
  


  if(type === 'short' && tile?.craft)
    return (
      <div className={`flex flex-wrap bg-transparent text-wrap  font-normal ${textSize} ${className}`}>
        <p className={`${isIncrease && 'text-green-500'} ${isDecrease && 'text-red-500'} flex items-center gap-1`}>
          {getIcon()}
          {isIncrease && '+'}
          {isDecrease === 'decrease' && '-'}
          {tile.value}
          {tile.text.toLowerCase().includes('chance') && '%'}
          {tile.text.toLowerCase().includes('scarcer') && '%'}
        </p>


        <div className={getCraftColor() + ' bg-inherit px-1'}>
          {tile.craft.toUpperCase()}
        </div>

        <p>{tile.text.toLowerCase().includes('rating') && 'TIER RATING'}</p>

      
      
    
    
    </div>
    )



  return (
    <div className={`flex flex-wrap bg-transparent text-wrap  font-normal ${textSize} ${className}`}>
    
      <p className='bg-transparent text-wrap'>{displayText[0]}</p>
      {tile.craft && 
        <>
        <div className={getCraftColor() + ' bg-inherit px-1'}>
          {tile.craft.toUpperCase()}
        </div>
        <div className='bg-transparent text-wrap'>{displayText[1]}</div>
        </>
      
      }
    
    
    </div>
  )
}

export default TileTextDisplay