import React from 'react'
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
function Shop({shop}) {
  console.log(shop)

  const corpseTypes = [
    "any", 'beast', 'construct','demon', 'humanoid', 'undead'
  ]

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

  return (
    <div>
    <Dialog>
      <DialogTrigger className='w-full'>
        <Button className='flex gap-1 items-center w-full'>
          <GiCoffin className="bg-transparent rotate-90"/>
          Coffin shop
          <p className='opacity-40 text-xs bg-transparent h-full items-center flex'>({shop.length})</p>
        </Button>
      </DialogTrigger>
      <DialogContent className='border-0 flex flex-col gap-8 min-h-[80dvh] h-[80dvh]'>
        
        <DialogHeader>
          <DialogTitle className='flex items-center justify-center gap-2'>
            <GiCoffin/>
              Coffin Shop
            <GiCoffin/>
          </DialogTitle>
         
        </DialogHeader>

        <div className='h-full flex flex-col gap-4 overflow-scroll w-full'>
          {shop.map((item) =>{

            return (
              <div className='w-full' key={item}>
                <div className='flex gap-2 items-center bg-zinc-900 rounded-t h-10  '>
                  
                  <div className='bg-zinc-800 px-3  items-center rounded-tl flex h-full text-sm'>{item.amount}</div>
                  <TileTextDisplay tile={item} value={item.value} size={'sm'} className='p-2 w-full'/>
                  {/* <div>a</div> */}
                </div>
                <Separator className='opacity-40'/>
                <div className='w-full rounded-b flex justify-items-stretch h-6 '>
                  {corpseTypes.map((currentA, index)=>{
                    let foundCorpse = item.shoplist.find(el => el.corpse === currentA)
                    let value = foundCorpse?.value
                    return (
                      <div className='flex w-full' key={index}>
                      <div className={`bg-inherit rounded-b flex text-sm w-full items-center justify-center px-2 gap-1 ${value ? 'text-cyan-500' : 'opacity-20'}`}>
                       
                        {getAMPicon(currentA)}
                        {value? value : 0}
                      </div>
                      {(index !== corpseTypes.length - 1) &&
                      <Separator orientation='vertical' className=' opacity-25  h-full'/>
                      }
                      </div>
                    )
                  })}
                </div>
              </div>
            )
            
          })}
        </div>

        <div className='w-full'>
          <Button className='w-full'>Generate string</Button>
        </div>
      </DialogContent>
    </Dialog>
      
          
    
    </div>
  )
}

export default Shop