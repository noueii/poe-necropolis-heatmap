import { DialogContent, DialogTrigger, Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '../ui/dialog'
import React, {useState} from 'react'
import db from '../../../public/moddb.json' 
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { IoSearch } from "react-icons/io5";
import { Input } from '../ui/input'
import TileTextDisplay from './TileTextDisplay'

import { FaArrowRightArrowLeft, FaUpDownLeftRight } from "react-icons/fa6";

function DialogSelectMultiple({deleteAll,setSelectedTiles, length, cancelSelection}) {
  const [search, setSearch] = useState('')

  const isSearch = (el) =>{
    if(search === '') return true
    let textString = el.text
    textString = textString.replace('[value]', el?.value)
    textString = textString.replace('[craft]', el?.craft)
    textString = textString.toLowerCase()
    if(textString.includes(search)) return true
    return false
}

  function getAMPicon(type){
    switch(type){
      case 'row': return <FaArrowRightArrowLeft className='bg-transparent'/>
      case 'col': return <FaArrowRightArrowLeft className='rotate-90 bg-transparent'/>
      case 'adj': return <FaUpDownLeftRight className='bg-transparent'/>
    }
  }

  const buttonAmps = [
    {


        "text": "[value]% increased Effect of Corpses in this Grave Row",
        "value": 25,
        "maxValue": 0,
        "type": "amp",
        "ampType": "row",

    
    },
    {


        "text": "[value]% increased Effect of Corpses in this Grave Column",
        "value": 25,
        "maxValue": 0,
        "type": "amp",
        "ampType": "col",
        "required": 1

    
    },

    {

        "text": "[value]% increased Effect of Corpses adjacent to this Corpse",
        "value": 40,
        "maxValue": 0,
        "type": "amp",
        "ampType": "adj",
        "required": 1,
        "corpse": "any"
      
    },
  ]


  return (

      <Dialog className=''>
      <DialogTrigger>
        <Button className='flex gap-1 items-center'>
          <p className='bg-transparent'>CONFIRM SELECTION</p>
          <p className='bg-transparent opacity-40 text-xs'>({length})</p>
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[66dvw min-w-[66dvw] h-2/3 border-0 '>
        <div className={'w-full h-full overflow-hidden flex flex-col gap-4 '}>
          <DialogHeader className='w-full' >
            <DialogTitle className='flex justify-between w-full'>
            <p>Apply selection</p>
            
            </DialogTitle>
            <DialogDescription>
              Apply a modifier to all the selected tiles
            </DialogDescription>
            
          </DialogHeader>

          <div className='flex w-full h-full gap-4 overflow-hidden flex-col'>
            <div className='w-full flex gap-4 '>
              <DialogClose className='w-full'>
                <Button 
                variant='outline' 
                className='opacity-50 border-2 w-full hover:bg-red-500 hover:text-background border-red-500 text-red-500'
                onClick={() => deleteAll()}
              >
                DELETE ALL
            </Button>

              </DialogClose>
            
            <DialogClose className='w-full'>
              <Button variant='outline' className='opacity-50 border-2 w-full border-yellow-500 hover:bg-yellow-500 hover:text-background text-yellow-500' 
                onClick={() => cancelSelection()}
              >
                CANCEL SELECTION
              </Button>
            </DialogClose>
            
            </div>
            

          <div className='flex w-full h-full gap-4 overflow-hidden'>

          
          <div className=' h-full flex flex-col gap-2 w-full'>
                  {buttonAmps.map((el,index) =>{
                    if(el?.type === 'amp') 
                    return (
                        <Button 
                          onClick={() => setSelectedTiles(el)}
                          key={index}
                          className='text-wrap pt-2 hover:bg-accent hover:brightness-125 text-xs h-full flex gap-4 '>
                            <div className='text-cyan-500 text-8xl bg-transparent'>{getAMPicon(el.ampType)}</div>
                            <TileTextDisplay tile={el} value={el.value} className={'text-xl w-full '}/>
                          </Button>

                      
                    )
                  })}
          </div>

          <Separator orientation='vertical' className='opacity-30'/>
            
            <div className='flex flex-col gap-2 pt-2 h-full overflow-hidden w-full'>
              
              <div className='flex items-center gap-4 justify-center '> 
                <IoSearch className='h-6 w-6'/>
                <Input className='border-0 bg-inherit brightness-150' onChange={(e) => setSearch(e.target.value.toLowerCase())}></Input>
              </div>
            
              <div className=' overflow-scroll flex flex-col gap-2'>
                  {db.map((el,index) =>{
                    if((el?.type === 'normal' || el?.type === 'item')&& isSearch(el) )
                    return (


                        <Button 
                          onClick={() => setSelectedTiles(el)}
                          key={index}
                          className='text-wrap pt-2 hover:bg-accent hover:brightness-125 text-xs'>
                            
                            <TileTextDisplay tile={el} value={el.value}/>
                          </Button>

                      
                    )
                  })}
              </div>
            </div>
          
          
        </div>
        </div>
        </div>
      </DialogContent>
      </Dialog>

  )
}

export default DialogSelectMultiple