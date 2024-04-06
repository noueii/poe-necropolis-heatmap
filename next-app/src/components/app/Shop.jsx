import React, {useEffect, useState} from 'react'
import { Button } from '../ui/button'
import { GiCoffin } from "react-icons/gi";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DialogHeader } from '../ui/dialog';
import TileTextDisplay from './TileTextDisplay';
import { Separator } from '../ui/separator';
import { IoPaw } from "react-icons/io5";
import { IoSkullOutline } from "react-icons/io5";
import { GiHornedSkull } from "react-icons/gi";
import { GiStoneBust } from "react-icons/gi";
import { PiPersonLight } from "react-icons/pi";
import { GiSelect } from "react-icons/gi";
import { FaAngleRight } from "react-icons/fa6";
import ShopTile from './ShopTile';
import * as ld from 'lodash'
import { motion } from 'framer-motion';

import { AnimatePresence } from 'framer-motion';
function Shop({shop}) {

  const [customShop, setCustomShop] = useState(shop)

  useEffect(() =>{
    setCustomShop(shop)
  },[shop])
 
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

  
  function getTotalLength(){
    let length = 0
    for(let i = 0; i < customShop.length; i++){
      for(let j = 0; j < customShop[i].shoplist.length; j++){
        length += customShop[i].shoplist[j].value
      }
    }
    return length
  }

  const handleClickTile = (tile) =>{
 
    let newShop = customShop.filter((el) => !ld.isMatch(el, tile))
    console.log(newShop)
    setCustomShop(newShop)

    
    
  }

  function handleOpen(){
    setCustomShop(shop)
  }

  return (
    <div>
    <Dialog onOpenChange={() => handleOpen()}>
      <DialogTrigger className='w-full'>
        <Button className='flex gap-1 items-center w-full'>
          <GiCoffin className="bg-transparent rotate-90"/>
          Coffin shop
          <p className='opacity-40 text-xs bg-transparent h-full items-center flex'>({getTotalLength()})</p>
        </Button>
      </DialogTrigger>
      <DialogContent className='border-0 flex flex-col gap-4 min-h-[80dvh] h-[80dvh]'>
        
        <DialogHeader>
          <DialogTitle className='flex items-center justify-center gap-2'>
            <motion.div className='bg-transparent'
              animate={{rotateZ: [0, 360]}}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 2
              }}
            
            >
              <GiCoffin/>
            </motion.div>
              Coffin Shop
            <motion.div 
            animate={{rotateZ: [0, 360]}}
            transition={{
              delay:2,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className='bg-transparent'>
              <GiCoffin/>
            </motion.div>
          </DialogTitle>
          <DialogDescription>
            <p>Total corpses: {getTotalLength()}</p>
            <p>Clicking on a tile will delete it</p>
          </DialogDescription>
         
        </DialogHeader>
        <div className='h-full flex flex-col gap-4 overflow-scroll w-full'>
        <AnimatePresence 
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring" }}
          initial={{ scale: 0.8, opacity: 0 }}
          mode='sync'
          className='h-full flex flex-col gap-4 overflow-scroll w-full'>
          {customShop.map((item) =>{

            return (


              
                <ShopTile item={item} onClick={handleClickTile}/>
            )
            
          })}
        </AnimatePresence>
        </div>

        <div className='w-full'>
          <Button className='w-full'>Generate string</Button>
        </div>

        <div className='w-[200%] absolute left-[-50%] h-10 top-[-10%] rounded flex overflow-hidden '>
          {corpseTypes.map(type =>{
            return (
              <div className='text-cyan-500 flex w-full items-center justify-center gap-2' key={type}>
                {getAMPicon(type)}
                {type.toUpperCase()}
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
      
          
    
    </div>
  )
}

export default Shop