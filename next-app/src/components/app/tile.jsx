
'use client'
import React,{useState} from 'react'
import db from '../../../public/moddb.json' 
import { Dialog } from '../ui/dialog'
import { DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogContent } from '../ui/dialog'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Input } from '../ui/input'
import { IoSearch } from "react-icons/io5";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { FaArrowsUpDownLeftRight } from "react-icons/fa6";

function Tile({tile, x, y, onChange, amps, maxValue}) {

  let rgb = convertScoreToRGB(calculateAmps(), maxValue)
  if(tile.disabled) rgb = undefined
  const [openDialog, setOpenDialog] = useState(false)
  const [search, setSearch] = useState('')

  const ampsScore = calculateAmps(tile)
  console.log(amps)

  const isSearch = (el) =>{
      if(search === '') return true
      let textString = el.text
      textString = textString.replace('[value]', el?.value)
      textString = textString.replace('[craft]', el?.craft)
      textString = textString.toLowerCase()
      if(textString.includes(search)) return true
      return false
  }

  const setTile = (dbMod) =>{
    let newTile = dbMod
    newTile.disabled = tile.disabled
    onChange(newTile, x, y)
    setSearch('')
    setOpenDialog(false)
  }

  function calculateAmps () {
    let sum = 0
    for(let i = 0; i < amps.length; i++){
      sum += amps[i].value
    }
    return sum
  }

  function convertScoreToRGB (score, maxValue){
    const startColor = { red: 255, green: 0, blue: 0 }
    const endColor = { red: 0, green: 165, blue: 0 }
    const percentFade = score / maxValue
  
  
  
    var diffRed = endColor.red - startColor.red;
    var diffGreen = endColor.green - startColor.green;
    var diffBlue = endColor.blue - startColor.blue;
  
    diffRed = (diffRed * percentFade) + startColor.red;
    diffGreen = (diffGreen * percentFade) + startColor.green;
    diffBlue = (diffBlue * percentFade) + startColor.blue;
  
    const color = { red: diffRed, green: diffGreen, blue: diffBlue }
  
    return color
  }

  const getTileText = (tile) =>{
    return tile?.text?.replace('[value]', ampsScore).replace('[craft]',tile?.craft?.toUpperCase())
  }

  const resetTile = () =>{
    onChange({value: 1, disabled: tile.disabled}, x, y)
  }



  return (

    <Dialog className='w-screen' open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
      <DialogTrigger 
      onClick={() => setOpenDialog(true)}
      className={`w-full h-full bg-background rounded`}>
        <div className={`bg-inherit w-full h-full flex items-center justify-center rounded
          border-2 border-background 
          ${tile.disabled ? 'hover:scale-100 cursor-default' : 'hover:scale-110 cursor-pointer'}
      `}
      style={rgb && {background: `rgba(${rgb.red},${rgb.green},${rgb.blue},0.2)`}}
      
      >
        {!tile.disabled &&
          <div className='w-full h-full bg-inherit bg-opacity-40'
          style={rgb && {background: `rgba(${rgb.red},${rgb.green},${rgb.blue},0.2)`}}>
            
            {tile?.type &&
              <div className={`w-full h-full bg-inherit
              ${tile.type === 'normal' && 'bg-indigo-900'}
              ${tile.type === 'amp' && 'bg-purple-900'}
              flex items-center justify-center flex-col 
              `}>
                
                {tile?.ampType === 'col' && <FaArrowRightArrowLeft className='rotate-90 bg-inherit' size={'40%'}/>}
                {tile?.ampType === 'row' && <FaArrowRightArrowLeft className='bg-inherit ' size={'40%'}/>}
                {tile?.ampType === 'adj' && <FaArrowsUpDownLeftRight className='bg-inherit' size={'40%'}/>}
                {tile?.type === 'normal' && <p className='bg-inherit'>{calculateAmps()}%</p>}
                

                
              </div>
            }

                {(!tile.type && !tile.disabled) && 
                  <div className='w-full h-full flex items-center justify-center' style={rgb && {background: `rgba(${rgb.red},${rgb.green},${rgb.blue},0.2)`}}>
                    {calculateAmps()}%
                  </div>
                }

            
            
            
          </div>
        
        }
      </div>
      
      </DialogTrigger>
      {!tile.disabled &&
      <DialogContent className='text-white text-opacity-70 border-0 max-w-screen w-screen lg:w-1/2 lg:max-w-1/2 flex min-h-1/2 h-1/2'>
        <div className={'w-full'}>
          <div className={'w-full h-full overflow-hidden flex flex-col'}>
          <DialogHeader  >
            <DialogTitle>Applied Amplifiers</DialogTitle>
            <DialogDescription>
              A list of modifiers applied to this tile from other sources
            </DialogDescription>
          </DialogHeader>

          <div className='w-full h-full mt-4 overflow-scroll'>
            {amps.map((amp) =>{
              return (
                <div className='border-2 border-zinc-500 border-opacity-40 rounded p-1'>{getTileText(amp)}</div>
              )
            })}
          </div>
        </div>

        </div>
        <Separator orientation='vertical' className='h-full w-px bg-white' />
        <div className={'w-full h-full overflow-hidden flex flex-col'}>
          <DialogHeader >
            <DialogTitle>Tile Modifier</DialogTitle>
            <DialogDescription>
              Your current tile modifier
            </DialogDescription>
            
          </DialogHeader>

          <div className='flex w-full justify-between items-center'>
            <div className=''>{getTileText(tile)}</div>
            <Button className='bg-inherit text-red-900 hover:text-foreground hover:bg-red-950' onClick={() => resetTile()}>Remove</Button>
          </div>
          <div className='flex flex-col gap-2 pt-2 h-full overflow-hidden'>
            <Tabs className='h-full overflow-hidden flex flex-col'>
              <TabsList className='w-full bg-background brightness-150 flex justify-items-stretch data-[state=active]:brightness-125 '>
                <TabsTrigger value='amps' className='w-full '>Amps</TabsTrigger>
                <TabsTrigger value='normal' className='w-full'>Normal</TabsTrigger>
              </TabsList>

              <TabsContent value='normal' className='h-full overflow-hidden flex flex-col gap-2 data-[state=inactive]:h-auto'>
                <div className='flex items-center gap-4 justify-center '> 
                  <IoSearch className='h-6 w-6'/>
                  <Input className='border-0 bg-inherit brightness-150' onChange={(e) => setSearch(e.target.value.toLowerCase())}></Input>
                </div>
              
                <div className=' overflow-scroll flex flex-col gap-2'>
                    {db.map((el) =>{
                      if(el?.type === 'normal' && isSearch(el) )
                      return (


                          <Button 
                            onClick={() => setTile(el)}
                            className='text-wrap pt-2 hover:bg-accent hover:brightness-125 text-xs'>{el.text.replace('[value]',el.value).replace('[craft]',el?.craft?.toUpperCase())}</Button>

                        
                      )
                    })}
                  </div>
              </TabsContent>

              <TabsContent value='amps' className='h-full flex flex-col gap-2 data-[state=inactive]:h-auto overflow-scroll'>
                {db.map((el) =>{
                        if(el?.type === 'amp')
                        return (


                            <Button 
                            onClick={() => setTile(el)}
                            className='text-wrap pt-2 hover:bg-accent hover:brightness-125 text-xs'>{el.text.replace('[value]',el.value).replace('[craft]',el?.craft)}</Button>

                          
                        )
                    })}
              </TabsContent>
            </Tabs>
            
          </div>
          
        

        <div>

        </div>
        </div>
        </DialogContent>
}

    </Dialog>


    
  )
}

export default Tile