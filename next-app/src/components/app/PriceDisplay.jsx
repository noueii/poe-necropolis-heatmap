import Image from 'next/image'
import React, {useEffect, useState} from 'react'
import chaosImg from '../../../public/Images/poe-chaos.png'
import divineImg from '../../../public/Images/poe-divine.png'
import { Button } from '../ui/button'
import { MdRefresh } from "react-icons/md";
import { getServerTime, getTimeCookie } from '@/lib/cookie'


function PriceDisplay({divchaos, tiles, prices, ilvl, refreshPrice}) {

  const [loading, setLoading] = useState()
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    const intervalID = setInterval(() =>  {
        const f = async() =>{
          setDisabled(await isRefreshDisabled())
        }
        f()
    }, 1000);

    return () => clearInterval(intervalID);
}, []);
  

  const cumulatedPrice = prices ? getCumulatedPrice() : 0

  // getCumulatedPrice()
  function getCumulatedPrice(){
    let result = 0
    for(let i = 0; i < tiles.length; i++){
      result += getTilePrice(tiles[i])
    }
    return result
  }


  function getTilePrice(tile){
    if(tile?.ampType === 'adj'){
      let result = 0
      for(let i = 0; i < tile.shoplist.length; i++){
        tile.corpse = tile.shoplist[i].corpse === 'any' ? 'beast' : tile.shoplist[i].corpse
        result += getMatchPrice(tile) * tile.shoplist[i].value
      }
      return result
    }

    let result = 0
    result = getMatchPrice(tile) * tile.amount
    

      if(result > 0) return result
     
      return 0
    }
    
  
  async function isRefreshDisabled (){
    console.log('enter disabled')
    let current = await getServerTime()
    let last = await getTimeCookie()
    let lastTime = last.value.replaceAll('"','')
    lastTime = new Date(lastTime)

    console.log(current.getTime() - lastTime.getTime() < 30000)
    if(current.getTime() - lastTime.getTime() < 30000) return true
    return false
  }


  function getMatchPrice(tile){

    let tileText = tile.text.replace('[value]',tile.value)
    if(tile?.craft) tileText = tileText.replace('[craft]',tile?.craft)
    tileText = tileText.toLowerCase()

    if(tile?.ampType === 'adj'){
      let split = tileText.split('corpses')
      tileText = split[0] + tile.corpse + ' corpses' + split[1]
    }
   
    let matches = prices.find((el) => {
      let parsedText = (el.text.replaceAll('\n',' ')).toLowerCase()
      console.log(parsedText)
      return parsedText === tileText
    })

  

    

    if(!matches) return 0
    return matches.price

  }

 

  return (
    <div className='flex gap-2'>
      <Button size='sm' variant='ghost' className='py-2 px-1' disabled={disabled} onClick={() => refreshPrice()}>
        <MdRefresh className='bg-transparent text-xl' />
      </Button>
      <div className='flex gap-1 h-6 items-center'>
        <p className='text-xl'>{cumulatedPrice.toFixed(1)} </p>
        <Image
          src={chaosImg}
          width={24}
          height={16}
          quality={100}
        />
      </div>
      <p>=</p>
      <div className='flex gap-1 h-6 items-center' >
        <p className='text-xl'>{(cumulatedPrice / divchaos).toFixed(1)}</p>
        <Image
          src={divineImg}
          width={24}
          height={16}
          quality={100}
        />
      </div>
    </div>
  )
}

export default PriceDisplay