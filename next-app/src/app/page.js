
'use client'
import Image from "next/image";
import db from '../../public/moddb.json'
import { Button } from "@/components/ui/button";
import Tile from "@/components/app/tile";
import {useEffect, useState} from 'react'
import TileTextDisplay from "@/components/app/TileTextDisplay";
import { Dialog } from '../components/ui/dialog'
import { DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogContent } from '../components/ui/dialog'
import { Textarea } from "@/components/ui/textarea";
import { FaArrowRightArrowLeft, FaEraser, FaUpDownLeftRight } from "react-icons/fa6";
import { FaArrowsUpDownLeftRight } from "react-icons/fa6";
import { BiSolidEraser } from "react-icons/bi";
import { PiExport } from "react-icons/pi";
import { GiCoffin } from "react-icons/gi";
import { encodeBase64 } from "bcryptjs";
import { GoDotFill } from "react-icons/go";
import bcrypt from 'bcryptjs-react'
import { FiTrash } from "react-icons/fi";
import Shop from "@/components/app/Shop";
import axios from "axios";
import * as ld from 'lodash'

import { BiRedo, BiUndo } from "react-icons/bi";

import CryptoJS, { AES } from 'crypto-js';
import { getTimeCookie, setTimeCookies } from "@/lib/cookie";
import PriceDisplay from "@/components/app/PriceDisplay";
import Link from "next/link";
import DialogSelectMultiple from "@/components/app/DialogSelectMultiple";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import StickyDisplay from "@/components/app/StickyDisplay";
import ContextMenuWrapper from "@/components/app/ContextMenuWrapper";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { MdKeyboardControlKey } from "react-icons/md";
import { BsDot } from "react-icons/bs";
import Kbd from "@/components/ui/kbd";

export default function Home() {
  



  const defaultMatrix = [
    [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1],
    [0,0,0,1,1,1,1,0,0,0,0,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,0,0,0,0,1,0,0,1,1,1],
    [1,1,1,1,0,1,1,1,0,0,0,1,1,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,1,1],
    [1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1],
    [1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1]
  ]

  const [ctrlToggle, setCtrlToggle] = useState(false)
  const [ctrlRelease, setCtrlRelease] = useState(true)
  const [highlight, setHighlight] = useState(undefined)
 
  const [prices, setPrices] = useState()
  const [lastPriceCheck, setLastPriceCheck] = useState(new Date())
  const [exported, setExported] = useState(false)
  const [divchaos, setDivchaos] = useState(undefined)
  const [ilvl, setIlvl] = useState(84)
  const [priceError, setPriceError] = useState('')
  


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
    {
      text: "ERASE",
      value: {
        value: 1,
        disabled: false
    }
    }
  ]

 



  const eraseTile = {
    text: "erase",
    value: {
      value: 1,
      disabled: false
    }
  }
  
  useEffect(() =>{
  

    const getCookie = async () =>{
      let cookie = await getTimeCookie()
      await fetchAllPrices()
    }
    getCookie()


    window.addEventListener("keydown", (event) => {
      if(event.repeat || !event.ctrlKey) return
      let btn = document.getElementById('ctrlbutton')
        setCtrlToggle(prev => !prev)

    });

    document.addEventListener("keyup", (event) => {
      
      if(event.ctrlKey){
       
        
      }
    });
  
  },[])

 

  const [paintTile, setPaintTile] = useState(undefined)

  const [importText, setImportText] = useState('')

  let {valueHeatmap, maxValue} = generateHeatmap()

  const [tiles, setTiles] = useState(generateTileMatrix(defaultMatrix))
  const [historyMatrix, setHistoryMatrix] = useState([generateTileMatrix(defaultMatrix)])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectMultiple, setSelectMultiple] = useState(false)
  const [selectedTilesForBatch, setSelectedTilesForBatch] = useState([])


  function generateTileMatrix(defaultMatrix){
    let copy = JSON.parse(JSON.stringify(defaultMatrix))
    for(let i = 0; i < defaultMatrix.length; i++){
      for(let j = 0; j< defaultMatrix[i].length; j++){
        if(defaultMatrix[i][j] === 0) {
          copy[i][j] = {disabled: true}
          continue
        }
        copy[i][j] = {
          value: 1,
          disabled: false,
        }
      }
    }
    return copy
  }


  function addHistory(matrix){
    let copy = historyMatrix.slice(0,historyIndex + 1)
    if(ld.isEqual(copy[copy.length - 1], matrix)) return
    copy.push(matrix)
    
    setHistoryMatrix(copy)
    setHistoryIndex(copy.length - 1)

  }

  function undoHistory(){
    if(historyIndex === 0) return
    let newIndex = historyIndex - 1
    setTiles(historyMatrix[newIndex])
    setHistoryIndex(newIndex)
  }

  function redoHistory(){
    if(historyIndex === historyMatrix.length - 1) return
    let newIndex = historyIndex + 1
    setTiles(historyMatrix[newIndex])
    setHistoryIndex(newIndex)
  }

  

  const changeTile = (newTile, x, y) =>{
    if(selectMultiple){
      handleSelectBatchTile()
    }

    let copy = JSON.parse(JSON.stringify(tiles))
    // console.log(newTile)
    copy[x][y] = newTile
    setTiles(copy)
    addHistory(copy)
  }

  

  function generateHeatmap(){
    let valueMatrix = JSON.parse(JSON.stringify(defaultMatrix))
    let maxValue = 1
    for(let i = 0; i < defaultMatrix.length; i++){
      let row = defaultMatrix[i]
      for(let j = 0; j < row.length; j++){
        if(defaultMatrix[i][j] === 0) continue
        let generatedAdjacent = generateAdjacent(i, j)
        let value = 1
        // console.log('ROW: ' + i + " COL: " + j)
        for(let k = 0; k < generatedAdjacent.length; k++){
          let el = generatedAdjacent[k]
          // console.log(el)
          let dmr = defaultMatrix[el.row][el.col]
          if(dmr === 1) value ++
        }
        valueMatrix[i][j] = value
        if(value > maxValue) maxValue = value
      }
    }
    return {valueHeatmap: valueMatrix, maxValue: maxValue}
  }

  function generateAdjacent(row,col){
    let array = [
      {row: row, col: col - 1},
      {row: row + 1, col: col},
      {row: row, col: col + 1},
      {row: row - 1, col: col},
    ]

    let result = []
    array.map(el =>{
      if(el.row < 0 || el.row > 7) return
      if(el.col < 0 || el.col > 17) return
      result.push(el)
    })
    return result
  }

  const convertScoreToRGB = (score, maxValue) =>{
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

  const getTileAmps = (x,y) =>{
    let rowAmp = getRowAmps(x,y)
    let colAmp = getColAmps(x,y)
    let adjAmp = getAdjAmps(x,y)

    return rowAmp.concat(colAmp).concat(adjAmp)
  }

  const getRowAmps = (x, y) =>{
    let result = []

    for(let i = y - 1; i >= 0; i--){
      if(tiles[x][i].disabled) break
      if(tiles[x][i]?.ampType === 'row') result.push(tiles[x][i])
    }

    for(let i = y + 1; i < 17; i++){
      if(tiles[x][i].disabled) break
      if(tiles[x][i]?.ampType === 'row') result.push(tiles[x][i])
    }

    
    return result
  }

  const getColAmps = (x,y) =>{
    let result = []

    for(let i = x; i >= 0; i--){
      if(tiles[i][y].disabled) break
      if(tiles[i][y]?.ampType === 'col') result.push(tiles[i][y])
    }

    for(let i = x; i < 8; i++){
      if(tiles[i][y].disabled) break
      if(tiles[i][y]?.ampType === 'col') result.push(tiles[i][y])
    }

    
  return result

  }

 

  function calculateAmps (amps) {
    let sum = 0
    for(let i = 0; i < amps.length; i++){
      sum += amps[i].value
    }
    return sum
  }

  const sortAppliedMods = () =>{
    let array = getAppliedMods()

    let result = array.sort((a,b) =>{
      if(a.tagType === 'increase'){
        if(a.craft){
          if(b.tagType === 'increase' && b.craft) return 0
          return -1
        }
        if(b.craft) return 1
        if(b.tagType === 'increase' ) return 0
        if(b.tagType === 'decrease') return -1
        return 1
      }

      if(a.tagType === 'decrease'){
        if(a.craft){
          if(b.craft){
            if(b.tagType === 'decrease') return 0
            return 1
          }
          return -1
        }
          if(b.craft || b.tagType === 'increase') return 1
          if(b.tagType === 'decrease') return 0
          return 1
        
      }

      // if(a.tagType === 'decrease'){
      //   if(b.tagType === 'increase') return 1
      //   if(b.tagType === 'decrease') return 0
      //   return -1
      // }

      return 1
    })
    return result
  }



  const getAppliedMods = () =>{
    let result = []

    for(let i = 0; i < tiles.length; i++){
      for(let j  = 0; j < tiles[i].length; j++){
        let current = tiles[i][j]
        if(tiles[i][j].disabled || tiles[i][j]?.type === 'amp' || !tiles[i][j].text) continue
        let found = false
        for(let k = 0; k < result.length; k++){
          if(result[k].text === current.text && result[k]?.craft === current.craft){
            // console.log('found')
            // console.log(tiles[i][j])
            found = true
            let increase = calculateAmps(getTileAmps(i,j))

            result[k].increase += increase
            result[k].value += tiles[i][j].value * (1 + increase / 100)
            break
          }
        } 
        if(!found) {

          let increase = calculateAmps(getTileAmps(i,j))  
          
          result.push({
            ...current,
            value: current.value * (1 + increase/100)
          })
        }
      }
    }
    return result
  }

  

  const getAdjAmps = (x,y) =>{
    let result = []

    let adjArray = [
      {x: x, y: y - 1},
      {x: x + 1, y: y},
      {x: x, y: y + 1},
      {x: x-1, y: y},
    ]

    for(let i = 0; i < adjArray.length; i++){
      let currentPos = adjArray[i]
      if(currentPos.x > 7 || currentPos.x < 0 || currentPos.y < 0 || currentPos.y > 16) continue
      if(tiles[currentPos.x][currentPos.y].disabled) continue
      if(tiles[currentPos.x][currentPos.y]?.ampType === 'adj') result.push(tiles[currentPos.x][currentPos.y])
    }

    
  return result
  }

  

  const log = async() =>{
    
    

  }

  async function exportBoard (){
    let key = 'nbTFpYn'
    navigator.clipboard.writeText(encryptData(tiles, key))
    setExported(true)
  }

  const importMatrix = () =>{
    let key = 'nbTFpYn'
    let newMatrix = decryptData(importText,key )
    setTiles(newMatrix)
    setHistoryMatrix([newMatrix])
    setHistoryIndex(0)
  }

  const encryptData = (data, secretKey) => {
    const encryptedData = AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encryptedData;
  };

  const decryptData = (encryptedData, secretKey) => {
    const decryptedData = AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  };

  const calculateMaxAmps = () =>{
    let maxValue = 40
    for(let i = 0; i < tiles.length; i++){
      for(let j = 0; j < tiles[i].length; j++){
        if(tiles[i][j].disabled) continue
        let amps = getTileAmps(i,j)

        for(let k = 0; k < amps.length; k++) {
          if(amps[k].value > maxValue) maxValue = amps[k].value
        }
      }
    }
    return maxValue
  }

  

  const changePaintTile = (btn) =>{
    setPaintTile(btn)
  }

  const paintSelectedTile = (x,y) =>{
    
    let copy = JSON.parse(JSON.stringify(tiles))
    if(copy[x][y]?.disabled ) return
    copy[x][y] = paintTile.value

    setTiles(copy)
    addHistory(copy)
    addPaintHistory(paintTile.value)
  }

  function addPaintHistory(mod){
    if(mod.ampType || !mod.text) return 
    
    const {setItem, getItem} = useLocalStorage('history')
    let x = getItem()
    x = x ? x : []
    x = x.filter(el => !isSameTileType(el, mod))
    let history = [mod].concat(x)
    
    history = history.slice(0, 10)
    setItem(history)
  }

  const resetExportImport = () =>{
    setExported(false)
    setImportText('')
  }

  const resetBoard = () =>{
    let newM = generateTileMatrix(defaultMatrix)
    setTiles(newM)
    setHistoryMatrix([newM])
    setHistoryIndex(0)
  }

  const getShop = () =>{
    let result = []
    for(let i = 0; i < tiles.length; i++){
      for(let j = 0; j < tiles[i].length; j++){
        let currentTile = tiles[i][j]
        if(!currentTile?.text) continue
        currentTile.shop = 'any'
        if(currentTile.type === 'amp') {
          if(currentTile.ampType === 'adj'){
            currentTile.shop = currentTile.corpse
          }
        }
        else {
          if(currentTile.tagType === 'increase' || currentTile.tagType === 'decrease'){
            let adjAmps = getAdjAmps(i, j)
            let corpseTypes = []
            for(let k = 0; k < adjAmps.length; k++){
              let foundAdj = false
              for(let m = 0; m < corpseTypes.length; m++){
                if(corpseTypes[m].corpse === adjAmps[k].corpse) {
                  corpseTypes[m].value ++
                  foundAdj = true
                  break
                }
                
              }
              if(!foundAdj) corpseTypes.push({corpse: adjAmps[k].corpse, value: 1})
            }
            // if(currentTile.craft === 'Physical') console.log(corpseTypes)
            let definiteCorpse = 'any'
            let maxCorpse = {corpse: 'any', value: 0}
            for(let m = 0; m < corpseTypes.length; m++){
              if(corpseTypes[m].value > maxCorpse.value){
                maxCorpse = corpseTypes[m]
              }
            }
            currentTile.shop = maxCorpse.corpse
          }
        }
        let resultFound = false
        for(let k = 0; k < result.length; k++){
          if(isSameTileType(result[k], currentTile)){
            resultFound = true
            result[k].amount++
            let found = false
            for(let m = 0; m < result[k].shoplist.length; m++){
              if(result[k].shoplist[m].corpse === currentTile.shop){
                result[k].shoplist[m].value ++
                found = true
                break
              }
            }
            if(!found){
              result[k].shoplist.push({corpse: currentTile.shop, value: 1})
            }
          }
        }
        if(!resultFound){
          result.push({
            ...tiles[i][j],
            amount: 1,
            shoplist: [{corpse: currentTile.shop, value: 1}]
          })
        }       

      }
    }
    return result
  }

  const isSameTileType = (a,b) =>{
    if(!a || !b) return false
    if(a.text !== b.text) return false
 
    if((a?.craft || b?.craft) && a?.craft !== b?.craft) return false
   
    
    return true
  }

  const fetchAllPrices = async() =>{
    
    
    
    let x = await axios.get(`/api/getPrices`).catch((error) => {
      setPriceError(error.response.data)
      return
    })

    if(!x) return
    setPrices(x.data.coffins)
    setDivchaos(x.data.divchaos)
    await setTimeCookies(new Date())
  }



  const handleCancelSelectMultiple = ()=>{
    setSelectedTilesForBatch([])
    setSelectMultiple(false)
  }

  function handleSelectBatchTile(x, y){
    let copy = JSON.parse(JSON.stringify(selectedTilesForBatch))
    let found = copy.find((el) => el.x === x && el.y === y)
    if(found){
      copy = copy.filter((el) => el.x !== x && el.y !== y)
      setSelectedTilesForBatch(copy)
      return 
    }
    copy.push({x: x, y: y})
    setSelectedTilesForBatch(copy)
  }

  const handleDeleteAllSelected = (tile) =>{
    let copy = JSON.parse(JSON.stringify(tiles))
    for(let i = 0; i < selectedTilesForBatch; i++){
      copy[x][y] = eraseTile.value
    }
    setTiles(copy)
    setSelectMultiple(false)
    setSelectedTilesForBatch([])
  }

  const handlePaintSelectMultiple = (tile) =>{
    let copy = JSON.parse(JSON.stringify(tiles))
    for(let i = 0; i < selectedTilesForBatch.length; i++){
      let {x,y} = selectedTilesForBatch[i]
      let newTile = tile
      newTile.disabled = tile.disabled
      copy[x][y] = newTile
    }

    setTiles(copy)
    setSelectMultiple(false)
    setSelectedTilesForBatch([])
  }

  const handleCancelSelection = () =>{
    setSelectedTilesForBatch([])
    setSelectMultiple(false)
  }
 
  


  return (
    <main className="flex h-[100dvh]  bg-background w-full p-2 ">
      <div className="w-full h-full  flex flex-col rounded gap-4 ">
        <div className="w-full  flex rounded gap-4 overflow-hidden h-full p-12 pb-0">
          <div className="flex flex-col  w-full h-full justify-between gap-4 px-2">
            <div className="flex justify-between">
              <div>
              <p className="text-2xl">PoE Graveyard Simulator</p>
              <p className="opacity-30">We need a guide, I know</p>
              </div>
              
              
              <PriceDisplay divchaos={divchaos} tiles={getShop()} prices={prices} refreshPrice={fetchAllPrices}/>
            </div>
            <div className="w-full  rounded  flex gap-2">
              {/* <Button onClick={() => fetchAllPrices()}>PRICE CHECK</Button> */}
              
              
              
              
              <div className="flex gap-2 items-center  rounded w-1/5">
              
                
                  
                  <p className="bg-transparent  self-start flex items-center h-full ">Paint tool</p>
                
                 <Kbd className='w-10 h-5 bg-orange-800 border-orange-800 text-background top-[-4px] relative' id='ctrlbutton' isActive={ctrlToggle}/>
                  <GoDotFill className={`${ctrlToggle ? 'text-green-500' : 'text-red-500'} `} />
                  
                
               

               

            </div>

            <div className="flex gap-2 items-center w-3/5 justify-center">
                <Button 
                onClick={() => undoHistory()} 
                disabled={historyIndex === 0} 
                variant='ghost'
                className='cursor-pointer'
                size='sm'
                ><BiUndo className="bg-transparent text-xl"/></Button>
                <p>{historyIndex + 1} / {historyMatrix.length}</p>
                <Button 
                onClick={() => redoHistory()} 
                disabled={historyIndex === historyMatrix.length - 1}
                variant='ghost'
                className='cursor-pointer'
                size='sm'
                ><BiRedo className="bg-transparent text-xl"/></Button>
            </div>

            <div className="flex gap-2 w-1/5 justify-end">

           
              {/* <Button onClick={() => log()}>Log</Button> */}
              {!selectMultiple && <Button variant='ghost' onClick={() => setSelectMultiple(true)}>Select Multiple</Button>}
              {(selectMultiple && selectedTilesForBatch.length > 0)&& 
                <DialogSelectMultiple 
                deleteAll={handleDeleteAllSelected} 
                setSelectedTiles={handlePaintSelectMultiple} 
                cancelSelection={handleCancelSelection}
                length={selectedTilesForBatch.length}
                />}
              {selectMultiple && selectedTilesForBatch.length ===0 && 
                <Button variant='ghost'  onClick={() => setSelectMultiple(false)}>Cancel</Button>
              }
              <Button className='hover:bg-transparent border-2 border-transparent hover:border-red-500' variant='ghost' onClick={() => resetBoard()}>
                <FiTrash className="text-red-500 bg-transparent h-4 w-4"/>
              </Button>
              <Dialog onOpenChange={() => resetExportImport()}>
                <DialogTrigger>
                  <Button className='' variant='ghost'>
                    <PiExport className="w-5 h-5 bg-transparent"/>

                  </Button>
                </DialogTrigger>
                <DialogContent className='border-0'>
                  <DialogTitle>Import/Export board</DialogTitle>
                  <DialogDescription>HEY</DialogDescription>
                  <div className="w-full flex flex-col gap-2">
                    <Textarea className='border-2 border-white ring-0 border-opacity-20' 
                    placeholder='Paste your code here'
                    onChange={(e) => setImportText(e.target.value)}>
                    
                    </Textarea>
                    <Button onClick={() => exportBoard()}> {!exported ? 'EXPORT' : 'Copied to clipboard !'} </Button>
                    <Button onClick={() => importMatrix()}> IMPORT </Button>
                  </div>
                </DialogContent>

              </Dialog>
            </div>
            </div>
            <div className="w-full h-full flex flex-col">
              {tiles.map((row, indexRow) =>{
                return (
                  <div 
                  key={indexRow}
                  className="h-full flex flex-row justify-between w-full items-center justify-items-center overflow-hidden ">
                    {row.map((col, indexCol) =>{
                      
                      return (
                        <div 
                        key={indexCol}
                        className={`w-full h-full flex  justify-center items-center rounded cursor-pointer `}
                        
                        >
                          <Tile 
                            tile={col}
                            x={indexRow}
                            y={indexCol}
                            onChange={changeTile}
                            amps={getTileAmps(indexRow, indexCol)}
                            maxValue={calculateMaxAmps()}
                            key={'tile-' + indexRow + '-' + indexCol}
                            clickDisabled={paintTile !== undefined && ctrlToggle}
                            paintTile={paintSelectedTile}
                            highlight={highlight}
                            selectedBatch={selectedTilesForBatch}
                            isActiveSelectMultiple={selectMultiple}
                            onSelectMultiple={handleSelectBatchTile}
                            

                            
                          />
                        </div>
                      )
                    })}
                  </div>
                )
              })}
              </div>
          </div>

          <div className="w-1/5 h-full overflow-hidden rounded gap-4 flex flex-col">
            <div className="text-2xl">Applied modifiers</div>
            <div className="text-2xl flex w-full h-full flex-col overflow-scroll gap-2">
              {sortAppliedMods()?.map((mod,index) =>{

                let newValue = (mod.value *(1+ mod.increase/100)).toFixed(2)
                let residual = mod.value > mod?.maxValue ? mod?.maxValue - mod.value : undefined
                
                let cText = mod?.text?.replace('[value]', mod.value.toFixed(2)).replace('[craft]',mod?.craft)
                
                let isHighlight = isSameTileType(mod, highlight)
                
                // console.log(mod)

                return (
                  <div
                    key={index}
                    className={
                      `bg-background brightness-150 rounded text-lg flex items-center w-full px-1 py-2 cursor-pointer  hover:bg-cyan-500 hover:bg-opacity-20
                        ${isHighlight && 'border-2 border-cyan-500'}
                      `
                      
                    }
                    onClick={() => setHighlight(mod)}
                    >
                    <TileTextDisplay tile={mod} value={mod.value} size={'sm'} type={'short'}/>
                  </div>
                )
              })}
            </div>
            <Shop shop={getShop()}/>
          </div>
        </div>
        <div className="w-full flex p-2 justify-center flex-col gap-2 items-center ">
          <div className="flex gap-2">
            <p className="opacity-40">Made by</p>
            <p className="text-orange-600 opacity-100 ">@noueii</p>
          </div>
          <div className="text-sm  flex w-full justify-between">
            <p className="opacity-40">This product is not affiliated with or endorsed by Grinding Gear Games in any way.</p>

            <div className="flex gap-1">
            <p className="text-foreground opacity-40">
              Prices provided by 
            </p>
            <Link className="text-orange-500 opacity-100" href="https://poe.ninja/" rel="noopener noreferrer" target="_blank">poe.ninja</Link>
            </div>
            

            
          </div>
        </div>
        <StickyDisplay isActive={ctrlToggle} paintTile={paintTile}/>
        <ContextMenuWrapper paintTile={paintTile} changePaintTile={changePaintTile} setCTRL={setCtrlToggle}/>
      </div>
    </main>
  );
}
