import React from 'react'
import {motion} from 'framer-motion'

function Kbd({className, id,isActive}) {


  return (
    <motion.div class={`button   cursor-pointer select-none
    
    rounded-full  
    
    ${className}
  `}
    id={id}
    animate={{
      translateY: isActive ? [0,4] : [4,0],
      boxShadow: isActive ?  ['0 2px 0 0 #6c240d,0 4px 0 0 #913521', '0 0px 0 0 #689121,0 0px 0 0 #5b9121'] : ['0 0px 0 0 #689121,0 0px 0 0 #5b9121', '0 2px 0 0 #6c240d,0 4px 0 0 #913521'],
      borderBottomWidth: isActive ? [1,0] : [0,1],
      backgroundColor: isActive ? ['#bb4328' , '#45d81a'] : [ '#45d81a', '#bb4328' ],
      scale: isActive ? [1.1, 1] : [1, 1.1]
    }}

    transition={{type: 'just'}}
  >
		<span class='flex flex-col justify-center items-center h-full text-black font-bold text-xs bg-transparent'>CTRL</span>
	</motion.div>
  )
}

export default Kbd