'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
function CookieConsent({store}) {
  return (
    <div className='fixed bottom-2 w-full flex justify-center bg-transparent'>
      <motion.div 
        className='w-2/5  bg-black rounded bg-opacity-70 flex flex-col justify-end p-2 gap-2'
        animate={{y: [500,0]}}
        transition={{type: 'spring' , stiffness: 30}}
      >
        <div className='w-full h-full rounded text-sm p-2'>
          <p>
            We and selected third parties use cookies or similar technologies for technical purposes and, with your consent, for other purposes.
            You can freely give, deny, or withdraw your consent at any time by accessing the preferences panel. Denying consent may make related features unavailable. 
          </p>
          <p>Use the “Accept” button to consent.</p>

        </div>

        <div className='bg-transparent w-full justify-stretch flex gap-2'>
          <Button className='w-full'>Accept</Button>
          <Button className='w-full'>Customize</Button>
        </div>

      </motion.div>
    </div>
  )
}

export default CookieConsent