
'use client'
import React, { useEffect, useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'

import { FaArrowsUpDownLeftRight } from "react-icons/fa6";
import { BiSolidEraser } from "react-icons/bi";
import { FaArrowRightArrowLeft, FaUpDownLeftRight } from "react-icons/fa6";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Button } from '../ui/button';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import db from '../../../public/moddb.json' 
import TileTextDisplay from './TileTextDisplay';
import { FaRegStar, FaStar } from "react-icons/fa";
import { useLocalStorage } from '@/lib/useLocalStorage';
import { toFirstUpper } from '@/lib/utils';
import { FaHistory } from "react-icons/fa";


function ContextMenuWrapper({paintTile, changePaintTile, setCTRL}) {

  const [showMenu, setShowMenu] = useState(undefined)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [favorites, setFavorites] = useState(getFavorites())
  const [history, setHistory] = useState(getHistory())

  
  const isSameTileType = (a,b) =>{
    if(!a || !b) return false
    if(a.text !== b.text) return false

    if((a?.craft || b?.craft) && a?.craft !== b?.craft) return false
   
    if(a.tier !== b.tier) return false
    return true
  }

  const isSearch = (el) =>{
    if(search === '') return true
    let textString = el.text
    textString = textString.replace('[value]', el?.value)
    textString = textString.replace('[craft]', el?.craft)
    textString = textString.toLowerCase()
    if(textString.includes(search)) return true
    return false
}



  const buttonAmps = [
    {
      text: 'ROW', 
      value: {
        "text": "[value]% increased Effect of Corpses in this Grave Row",
        "value": 25,
        "maxValue": 0,
        "type": "amp",
        "ampType": "row",
        "required": 1
      }
    
    },
    {
      text: 'COL', 
      value: {
        "text": "[value]% increased Effect of Corpses in this Grave Column",
        "value": 25,
        "maxValue": 0,
        "type": "amp",
        "ampType": "col",
        "required": 1
      },
    
    },

    {
      text: 'ADJ', 
      value: {
        "text": "[value]% increased Effect of Corpses adjacent to this Corpse",
        "value": 40,
        "maxValue": 0,
        "type": "amp",
        "ampType": "adj",
        "required": 1,
        "corpse": "any"
      },
    },
  ]

  useEffect(() =>{
    document.addEventListener("contextmenu", (event) =>{

      setShowMenu({x: event?.clientX, y: event?.clientY})
      setHistory(getHistory())
      
      event.preventDefault()
      
    })

    document.addEventListener("click", (event) =>{
      let context = document.getElementById('customcontext')

      if(!context) return
      if(!context.contains(event.target)){
        setSearch('')
        setShowMenu(undefined)
      }
      
    })

  },[])

  const getCraftColor = (tile) =>{
    let type = tile?.craft?.toLowerCase()
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

  function isTileFavorite(tile){
    for(let i = 0; i < favorites?.length; i++){
      if(isSameTileType(favorites[i],tile)) return true
    }
    return false
  }

  function addFavorite (mod){
    const {setItem, getItem} = useLocalStorage('favorites')
    let x = favorites ? favorites : []
    x.push(mod)
    setItem(x)

    setFavorites(getItem())
  }

  function removeFavorite (mod){
    const {getItem, setItem} = useLocalStorage('favorites')
    let arr = getItem()
    arr = arr.filter((el => !isSameTileType(el, mod)))
    setItem(arr)
    setFavorites(arr)
  }

  function getFavorites(){
    const {getItem} = useLocalStorage('favorites')
    return getItem()
  }


  function handleFavorite(mod){
    for(let i = 0; i < favorites.length; i++){
      if(isSameTileType(favorites[i], mod)){
        removeFavorite(mod)
        return
      }
    }
    addFavorite(mod)
  }

  function addHistory(mod){
    const {setItem} = useLocalStorage('history')
    let x = history ? history : []
    x.push(mod)
    setItem(x)

    setHistory(getHistory())
  }

  function getHistory(){
    const {getItem} = useLocalStorage('history')
    let resp = getItem()

    return resp ? resp : []
  }

  function handleChangePaintTile(mod){
    let paint = {
      text: mod?.tagType + ' ' + mod?.tag,
      value: mod
    }
    changePaintTile(paint)
    setCTRL(true)
    setShowMenu(false)

    setSearch('')

  }



  if(showMenu)
  return (
    <div className={` fixed z-20 bg-transparent flex gap-2 `} style={{left: showMenu.x, top:showMenu.y}} id='customcontext'>
      <div className='flex bg-transparent rounded flex-col gap-2'>

      
        <div className='flex bg-transparent bg-zinc-900 gap-1 h-[52px] p-2 rounded items-center'>
          <ToggleGroup type='single' className='bg-transparent ' size='sm'>

                    
            {buttonAmps.map((b) =>{
              let isSelected = paintTile?.text === b.text
              let clicked = false
              return (

                <ToggleGroupItem variant='ghost' 
                  size='sm'
                  className={`bg-inherit border-0 hover:bg-purple-600 text-purple-600 hover:text-background flex gap-2 items-center
                  ${isSelected && 'bg-purple-600 text-background'} 
                  data-[state=on]:bg-inherit data-[state=on]:text-purple-600 data-[state=on]:border-2 data-[state=on]:border-purple-600 
                  `}
                  onClick={() => changePaintTile(b)}
                  key={b.text}
                  value={b.text}
                >
                  {b.text === 'ROW' && <FaArrowRightArrowLeft className="bg-inherit "/>}
                  {b.text === 'COL' && <FaArrowRightArrowLeft className="rotate-90 bg-inherit"/>}
                  {b.text === 'ADJ' && <FaUpDownLeftRight className="bg-inherit"/>}
                  
                  {/* <p className="bg-transparent">{b.text}</p> */}
                </ToggleGroupItem>
              )
            })}
            
            </ToggleGroup>
          
          <Button className=' px-[7px] h-8 flex items-center w-full justify-center rounded text-purple-600 bg-inherit hover:bg-purple-600 hover:text-background gap-2'
            size='md'
            onClick={() => setShowSearch(!showSearch)}
          >
            <p className='bg-transparent'>Search</p>
            <FaMagnifyingGlass className='bg-transparent'/>
          </Button>
        </div>

        <div className='flex bg-transparent  rounded items-center justify-center flex-col gap-4'>
          <div className='bg-zinc-900 w-full flex flex-col justify-center shadow-md shadow-black gap-2 p-2 rounded'>

          
            <div className='bg-inherit flex gap-2 items-center justify-center rounded'>
              <FaStar className='bg-transparent text-yellow-400'/>
              <p className='bg-transparent'>Favourites</p>
              
            </div>
            <Separator className='opacity-40'/>
            <div className='bg-transparent p-1 flex flex-col gap-1 max-h-48 overflow-scroll '>
                {!favorites && <p className='bg-transparent text-sm px-2 opacity-40'>Could not find favorites</p>}
                {favorites && 
                  favorites.map((el,index) =>{
                    return (
                      <div className='bg-zinc-800 rounded flex' key={index}>
                        <Button
                          className='w-full bg-transparent flex gap-1 hover:bg-accent hover:brightness-125 text-sm rounded-r-none justify-start'
                          onClick={() => {handleChangePaintTile(el)}}
                        >
                          <p className='bg-transparent'>{toFirstUpper(el?.tagType)} </p>
                          <p className={`${getCraftColor(el)} bg-transparent`}>{el?.tag.toUpperCase()}</p>
                        </Button>

                        <Button className=' bg-inherit rounded-l-none hover:bg-accent hover:brightness-125' onClick={() => removeFavorite(el)}>
                          <FaStar className='bg-transparent text-yellow-400'/>
                        </Button>
                        
                      </div>
                    )
                  })
                }
              </div>
          </div>

          <div className='bg-zinc-900 w-full flex flex-col justify-center  shadow-md shadow-black rounded p-2 gap-2'>

          
            <div className='bg-inherit flex gap-2 items-center justify-center  rounded'>
              <FaHistory className='bg-transparent text-yellow-400'/>
              <p className='bg-transparent '>History</p>

             
            </div>

            <Separator className='opacity-40'/>

            <div className='bg-inherit flex flex-col gap-1 max-h-48 overflow-scroll p-1'>
            {!history || history.length === 0 && <p className='bg-transparent text-sm px-2 opacity-40'>No history to display</p>}
              {history && 
                history?.map((el) =>{
                  return (
                    <div className='bg-zinc-800 rounded flex'>
                        <Button
                          className='w-full bg-transparent flex gap-1 hover:bg-accent hover:brightness-125 text-sm rounded-r-none justify-start'
                          onClick={() => {handleChangePaintTile(el)}}
                        >
                          <p className='bg-transparent'>{toFirstUpper(el?.tagType)} </p>
                          <p className={`${getCraftColor(el)} bg-transparent`}>{el?.tag?.toUpperCase()}</p>
                        </Button>

                        
                        
                      </div>
                  )
                })
              
              }
            </div>
          </div>
        </div>
      </div>
      {showSearch && 
        <div className='bg-transparent flex flex-col gap-2 w-96'>
          <div className='p-2 flex flex-col  bg-zinc-900 gap-2 rounded'>
            <div className='bg-zinc-900 w-full '>
              <Input 
              placeholder='Search...'
              className='border-0 focus-visible:ring-0 bg-zinc-800 bg-opacity-80 shadow-xs shadow-black' onChange={(e) => setSearch(e.target.value)}/>
            </div>
          
          </div>
          
          <div className='p-2 flex flex-col bg-zinc-900 gap-2 rounded w-full max-h-96 overflow-scroll'>
            <div className='bg-zinc-900 flex flex-col w-full gap-1 '>
                    {db.map((el,index) =>{
                        let isFavourite = isTileFavorite(el)
                        let isPaint = isSameTileType(paintTile, el)

                          if((el?.type === 'normal' || el?.type === 'item')&& isSearch(el) )
                          return (

                            <div className='bg-zinc-800 rounded  flex   w-full'>
                              <Button 
                                onClick={() => {handleChangePaintTile(el)}}
                                key={index}
                                className='text-wrap pt-2 hover:bg-accent hover:brightness-125 text-xs bg-inherit w-full rounded-r-none' >
                                  <TileTextDisplay tile={el} value={el.value}/>
                                </Button>
                              <Button className=' bg-inherit rounded-l-none hover:bg-accent hover:brightness-125' onClick={() => handleFavorite(el)}>
                               {isFavourite &&  <FaStar className='bg-transparent text-yellow-400'/>}
                               {!isFavourite && <FaRegStar className='bg-transparent hover:text-yellow-400'/>}
                              </Button>
                            </div>
                          )
                        })}

            </div >
          
          </div>
          

          
        </div>
      }
    
      {/* <Button onClick={() => getFavorites()}>LOG</Button> */}
      
    </div>
  )
}

export default ContextMenuWrapper