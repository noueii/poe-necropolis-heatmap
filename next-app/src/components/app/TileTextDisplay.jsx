import React from 'react'

function TileTextDisplay({tile, value, size}) {

  if(!tile) return

  let displayText = tile.text.replace('[value]',value)
  displayText = displayText.split('[craft]')

  if(tile.text === 'Armour Items have a Strength Requirement') console.log(displayText)

  let textSize = getTextSize()

  function getTextSize(){
    switch(size){
      case 'sm': return 'text-sm'
      case 'xs': return 'text-xs'
      case 'lg': return 'text-lg'
      case '2xl': return 'text-2xl'
      case 'xl': return 'text-xl'
      default: return ''
    }
  }

  const getCraftColor = () =>{
    let type = tile.craft.toLowerCase()
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

  return (
    <div className={`flex flex-wrap bg-inherit text-wrap  font-normal ${textSize}`}>
    
      <p className='bg-inherit text-wrap'>{displayText[0]}</p>
      {tile.craft && 
        <>
        <div className={getCraftColor() + ' bg-inherit px-1'}>
          {tile.craft.toUpperCase()}
        </div>
        <div className='bg-inherit text-wrap'>{displayText[1]}</div>
        </>
      
      }
    
    
    </div>
  )
}

export default TileTextDisplay