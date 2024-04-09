import React, { useEffect } from 'react'
import { toFirstUpper } from '@/lib/utils';
function StickyDisplay({isActive, paintTile}) {
  

 
  useEffect(() =>{
    window.addEventListener('mousemove', function(ev){
      document.getElementById('stickyDisplay').style.transform = 'translateY('+(ev.clientY-60)+'px)';
      document.getElementById('stickyDisplay').style.transform += 'translateX('+(ev.clientX-80)+'px)';            
    },false);
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

 
  return (
    
    <div className={`absolute p-2 rounded shadow-lg bg-zinc-900 ${!isActive && 'hidden'}`} id='stickyDisplay'>
      {!paintTile && <p className='bg-transparent'>Right click to select</p>}
      {paintTile && paintTile?.text !== 'ERASE' && paintTile?.ampType !== 'adj' &&
        <div className='flex bg-transparent gap-1'>
          <p className='bg-transparent'>{toFirstUpper(paintTile?.value?.tagType)} </p>
          <p className={`${getCraftColor(paintTile?.value)} bg-transparent`}>{paintTile?.value?.tag?.toUpperCase()}</p>
        </div>
      }

      {paintTile && paintTile?.value?.ampType &&
        <div className='flex bg-transparent gap-1'>
          <p className='bg-transparent'>AMP {paintTile?.value?.ampType.toUpperCase()} </p>
          
        </div>
      }
    </div>
  )
}

export default StickyDisplay