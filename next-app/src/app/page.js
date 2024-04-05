
'use client'
import Image from "next/image";
import db from '../../public/moddb.json'
import { Button } from "@/components/ui/button";
import Tile from "@/components/app/tile";
import {useState} from 'react'
import TileTextDisplay from "@/components/app/TileTextDisplay";
import { Dialog } from '../components/ui/dialog'
import { DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogContent } from '../components/ui/dialog'
import { Textarea } from "@/components/ui/textarea";

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
        "text": "Haunted by Hadrius Veruso",
        "maxValue": 0,
        "type": "normal",
        "required": 1,
        "tag": "Hadrius Veruso",
        "tagType": "haunt",
        "tier": 1
      },
    
    },

  ]

  const [paintTile, setPaintTile] = useState(undefined)

  const [importText, setImportText] = useState('')

  let {valueHeatmap, maxValue} = generateHeatmap()

  const [tiles, setTiles] = useState(generateTileMatrix(defaultMatrix))

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

  const changeTile = (newTile, x, y) =>{
    let copy = JSON.parse(JSON.stringify(tiles))
    copy[x][y] = newTile
    setTiles(copy)
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

  const getAppliedMods = () =>{
    let result = []

    for(let i = 0; i < tiles.length; i++){
      for(let j  =0; j < tiles[i].length; j++){
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

  

  const log = () =>{
    console.log(JSON.stringify(tiles))
  }

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

  const importMatrix = () =>{
    setTiles(JSON.parse(importText))
  }

  const changePaintTile = (btn) =>{
    if(paintTile?.text === btn.text) {
      setPaintTile(undefined)
      return
    }

    setPaintTile(btn)
  }

  const paintSelectedTile = (x,y) =>{
    let copy = tiles
    copy[x][y] = paintTile.value
    setTiles(copy)
  }


  return (
    <main className="flex h-screen p-12 bg-background w-full">
      <div className="w-full h-full flex rounded gap-4">
        
        <div className="flex flex-col  w-full h-full justify-between gap-4">
          <div className="w-full bg-zinc-900 rounded justify-end p-2 flex gap-2">
            {buttonAmps.map((b) =>{
              let isSelected = paintTile?.text === b.text
              return (
                <Button variant='ghost' 
                className={`bg-inherit border-0 hover:bg-purple-600 text-purple-600 hover:text-background ${isSelected && 'bg-purple-600 text-background'} `}
                onClick={() => changePaintTile(b)}
                
                >AMP {b.text}</Button>
              )
            })}


            
            <Button className='bg-red-900' onClick={() => log()}>RESET BOARD</Button>
            <Dialog>
              <DialogTrigger>
                <Button className='bg-red-900'>IMPORT BOARD</Button>
              </DialogTrigger>
              <DialogContent className='border-0'>
                <DialogTitle>Import/Export board</DialogTitle>
                <DialogDescription>HEY</DialogDescription>
                <div className="w-full flex flex-col gap-2">
                  <Textarea className='border-2 border-white ring-0 border-opacity-20' 
                  placeholder='Paste your code here'
                  onChange={(e) => setImportText(e.target.value)}>
                  
                  </Textarea>
                  <Button onClick={() => importMatrix()}> EXPORT </Button>
                  <Button onClick={() => importMatrix()}> IMPORT </Button>
                </div>
              </DialogContent>

            </Dialog>
            
          </div>
          <div className="w-full h-full flex flex-col">
            {tiles.map((row, indexRow) =>{
              return (
                <div 
                key={indexRow}
                className="h-full flex flex-row justify-between w-full items-center justify-items-center ">
                  {row.map((col, indexCol) =>{
                    

                    return (
                      <div 
                      key={indexCol}
                      className={`w-full h-full flex  justify-center items-center rounded cursor-pointer`}
                      
                      >
                        <Tile 
                          tile={col}
                          x={indexRow}
                          y={indexCol}
                          onChange={changeTile}
                          amps={getTileAmps(indexRow, indexCol)}
                          maxValue={calculateMaxAmps()}
                          key={'tile-' + indexRow + '-' + indexCol}
                          clickDisabled={paintTile !== undefined}
                          paintTile={paintSelectedTile}
                          
                        />
                      </div>
                    )
                  })}
                </div>
              )
            })}
            </div>
        </div>

        <div className="w-1/5 h-full overflow-hidden rounded">
          <div className="text-2xl">Applied modifiers</div>
          <div className="text-2xl flex w-full h-full flex-col overflow-scroll gap-2">
            {getAppliedMods()?.map((mod,index) =>{

              let newValue = (mod.value *(1+ mod.increase/100)).toFixed(2)
              let residual = mod.value > mod?.maxValue ? mod?.maxValue - mod.value : undefined
              
              let cText = mod?.text?.replace('[value]', mod.value.toFixed(2)).replace('[craft]',mod?.craft)
              
              console.log(mod)

              return (
                <div
                  key={index}
                  className="bg-background brightness-150 rounded text-lg flex items-center w-full px-1 py-2 ">
                  <TileTextDisplay tile={mod} value={mod.value} size={'sm'}/>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
