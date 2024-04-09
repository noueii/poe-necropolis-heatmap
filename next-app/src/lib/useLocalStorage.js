import db from '../../public/moddb.json'

export const useLocalStorage = (key) =>{
  const setItem = (value) =>{
    try{
      if(key === 'favourites' || key === 'history') {
        window.localStorage.setItem(key, JSON.stringify(verifyMods(value)))
        return
      }
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.log(err)
    }
  }

  const getItem = () =>{
    try{
      const item = window.localStorage.getItem(key)
      if(key === 'favourites' || key === 'history') return item ? verifyMods(JSON.parse(item)) : undefined
        return item ? JSON.parse(item) : undefined
    } catch(err){
      console.log(err)
    }
  }


  const verifyMods = (verArr) => {
    let result = []
    for(let i = 0; i < verArr.length; i++){
      if(!db.find((el) => isSameTileType(verArr[i],el))) continue
      result.push(verArr[i])
    }
    return result
  }


  const isSameTileType = (a,b) =>{
    if(!a || !b) return false
    if(a.text !== b.text) return false

    if((a?.craft || b?.craft) && a?.craft !== b?.craft) return false
   
    if(a.tier !== b.tier) return false
    return true
  }

  return {setItem, getItem}
}