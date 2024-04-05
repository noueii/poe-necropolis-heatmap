import fs from 'fs'
import { parseFromString } from 'dom-parser';
const modfile = fs.readFileSync('./necrohtml.html', 'utf-8')

let DOM = parseFromString(modfile)

let x = DOM.getElementById('modlist')

let children = x.getElementsByClassName("explicitMod")

let mods = []

for(let i = 0; i < children.length; i++){
  let modValue = children[i].getElementsByClassName('mod-value')
  let craftingTypes = generateCraftingCN()
  
  let text = children[i].textContent
  let modValueText
  let cCTText
  if(modValue.length > 0){
    modValueText = modValue[0].childNodes[0].text
    modValueText = modValueText.replace(/[-+%]/,'')
  }
  
  for(let j = 0; j < craftingTypes.length; j++){
    let cCT = children[i].getElementsByClassName(craftingTypes[j])
    if(cCT.length > 0){
       cCTText= cCT[0].childNodes[0].text
      text = text.replace(cCTText, '[craft]')
    }
  }

  if(modValue) text = text.replace(modValueText, '[value]')
  
  mods.push({
    text: text,
    value: modValueText ? parseInt(modValueText) : undefined,
    maxValue: 0,
    craft: cCTText ? cCTText : undefined,
    type: 'normal',
    required: 1
  })
}

function generateCraftingCN(){
  let types = ['physical','fire','cold','lightning','chaos','life','blue','attack','caster','red','defences','critical','speed','attribute','resistance','gem','minion','crit']
  for(let i = 0; i < types.length; i++){
    types[i] = 'crafting' +types[i]
  }
  return types
}

fs.writeFileSync('./moddb.json', JSON.stringify(mods))