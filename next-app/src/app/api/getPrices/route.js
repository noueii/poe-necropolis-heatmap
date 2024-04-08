import { NextResponse } from "next/server";
import axios from "axios";
import { getTimeCookie } from "@/lib/cookie";




export async function GET(request) {
  
  try {
    
    let timeCookie = request?.cookies?.lf
    let currentTime = new Date()
    let parsedTimeCookie = timeCookie ? new Date(timeCookie.value.replaceAll('"','')) : undefined

    if(parsedTimeCookie && currentTime.getTime() - parsedTimeCookie.getTime() < 30000) return new NextResponse('Too many requests', {status: 400})



    let prices = await axios.get('https://poe.ninja/api/data/itemoverview?league=Necropolis&type=Coffin')

    if(!prices || prices?.error || !prices.data) return new NextResponse('Fetch failed' , {status: 400})

    let rate = await axios.get('https://poe.ninja/api/data/currencyoverview?league=Necropolis&type=Currency')

    if(!rate || rate?.error || !rate.data) return new NextResponse('Fetch failed' , {status: 400})


    
    
    
    

    let refactoredPrices = refactorPrices(prices.data.lines)
    
  
    let result = {
      coffins: refactoredPrices,
      divchaos: rate.data.lines[8].chaosEquivalent
    }


    return new NextResponse(JSON.stringify(result))
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}

function refactorPrices(prices){
  if(!prices) return

  let result = []
  for(let i = 0; i < prices.length; i++){
    let currentItem = {
      text: prices[i].name,
      ilvl: prices[i].levelRequired, 
      price: prices[i].chaosValue,
    }
    if(currentItem.ilvl !== 84 && currentItem.ilvl !== 80 && currentItem.ilvl !== 70) continue
    result.push(currentItem)
  }
 
  return result
}