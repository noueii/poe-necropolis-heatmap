import React, { useState } from 'react'
import TileTextDisplay from './TileTextDisplay';
import { Separator } from '../ui/separator';
import { IoPaw } from "react-icons/io5";
import { IoSkullOutline } from "react-icons/io5";
import { GiHornedSkull } from "react-icons/gi";
import { GiStoneBust } from "react-icons/gi";
import { PiPersonLight } from "react-icons/pi";
import { GiSelect } from "react-icons/gi";
import { FaAngleRight } from "react-icons/fa6";
import { motion } from 'framer-motion';


function ShopTile({item, onClick}) {
  const [isClicked, setIsClicked] = useState(false)

  const getAMPicon = (type) =>{
    switch(type){
      case 'beast': return <IoPaw className='bg-inherit text-inherit'/>
      case 'undead': return <IoSkullOutline className='bg-inherit text-inherit'/>
      case 'demon': return <GiHornedSkull className='bg-inherit text-inherit'/>
      case 'construct': return <GiStoneBust className='bg-inherit text-inherit'/>
      case 'humanoid': return <PiPersonLight className='bg-inherit text-inherit'/>
      case 'any': return <GiSelect className='bg-inherit text-inherit'/>
    }
  }

  const corpseTypes = [
    "any", 'beast', 'construct','demon', 'humanoid', 'undead'
  ]

  function handleClick(){
    onClick(item)
  }
  
  return (
    <div  className='w-full ' key={item}>
      <div className='flex items-center bg-zinc-900 rounded-t h-10 overflow-hidden z-20'>
        
        <div className='bg-zinc-800 px-3  items-center rounded-tl flex h-full text-sm'>{item.amount}</div>
        <div className={`bg-inherit w-full h-full cursor-pointer hover:bg-red-300 hover:bg-opacity-15`} onClick={() => handleClick()}>

        
          <TileTextDisplay tile={item} value={item.value} size={'sm'} className='p-2 w-full'/>
        </div>
        <motion.div
          
          className={`bg-zinc-800 px-3  items-center rounded-tr flex h-full text-sm cursor-pointer `}
          onClick={() => setIsClicked(!isClicked)}>
            <motion.div
              layout
              animate={{
                
                rotateZ: isClicked ? 90 : 0,
              }}
              transition={{type: 'spring'}}
              className={`bg-inherit `}

            >
              <FaAngleRight className='bg-inherit'/>
            </motion.div>
          
        </motion.div>
      </div>
      {isClicked &&
      <>
        <Separator className='opacity-40'/>
        <motion.div 
        animate={{height: [5,20]}}
        transition={{type: 'spring'}}
        className='w-full rounded-b flex justify-items-stretch h-6 z-10 overflow-hidden '>
          { corpseTypes.map((currentA, index)=>{
            let foundCorpse = item.shoplist.find(el => el.corpse === currentA)
            let value = foundCorpse?.value
            return (
              <div className='flex w-full' key={index}>
              <div className={`bg-transparent rounded-b flex text-sm w-full items-center justify-center px-2 gap-1 ${value ? 'text-cyan-500' : 'opacity-20'}`}>
                
                {getAMPicon(currentA)}
                {value? value : 0}
              </div>
              {(index !== corpseTypes.length - 1) &&
              <Separator orientation='vertical' className=' opacity-25  h-full'/>
              }
              </div>
            )
          })}
        </motion.div>
      </>
      }
    </div>
  )
}

export default ShopTile