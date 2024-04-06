'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Separator } from '@radix-ui/react-separator'
import { Checkbox } from '../ui/checkbox'
import { setCCUCookies } from '@/lib/cookie'
function CookieConsent({store}) {
  const [isOpen, setIsOpen] = useState(false)

  const consents = [
    {
      title: 'Necessary',
      description: 'These trackers are used for activities that are strictly necessary to operate or deliver the service you requested from us and, therefore, do not require you to consent.',
      defaultOpen: false,
      key: 'nec'

    },
    {
      title: 'Functionality',
      description: 'These trackers enable basic interactions and functionalities that allow you to access selected features of our service and facilitate your communication with us.',
      defaultOpen: false,
      key: 'func'
    },
    {
      title: 'Experience',
      description: 'These trackers help us to improve the quality of your user experience and enable interactions with external content, networks and platforms.',
      defaultOpen: false,
      key: 'exp'
    },
    {
      title: 'Measurement',
      description: 'These trackers help us to measure traffic and analyze your behavior to improve our service.',
      defaultOpen: true,
      key: 'measure'
    },
    {
      title: 'Marketing',
      description: 'These trackers help us to deliver personalized ads or marketing content to you, and to measure their performance.',
      defaultOpen: false,
      key: 'market'
    },
  ]

  const [cookieSettings, setCookieSettings] = useState({
    nec: false,
    func: false,
    exp: false,
    measure: true,
    market: false
  })

  const handleCheckChange = (value, type) => {
    let newS = cookieSettings
    newS[type] = value
    setCookieSettings(newS)
  }

  const handleAccept = () =>{
    const values = {
      nec: true,
      func: true,
      exp: true,
      measure: true,
      market: true
    }
    setCCUCookies(values)
  }

  const handleReject = () =>{
    const values = {
      nec: false,
      func: false,
      exp: false,
      measure: false,
      market: false
    }
    setCCUCookies(values)
  }

  const confirmCookies = () =>{
    setCCUCookies(cookieSettings)
  }


  return (
    

    <div className='fixed bottom-2 w-full flex justify-center bg-transparent'>
      <motion.div 
        className='w-2/5  bg-black rounded bg-opacity-70 flex flex-col justify-end p-2 gap-2'
        animate={{y: [500,0]}}
        transition={{type: 'spring' , stiffness: 30}}
      >
        {!isOpen && 
        <>
        <div className='w-full h-full rounded text-sm p-8'>
          <p>
            We and selected third parties use cookies or similar technologies for technical purposes and, with your consent, for other purposes.
            You can freely give, deny, or withdraw your consent at any time by accessing the preferences panel. Denying consent may make related features unavailable. 
          </p>
          <p>Use the “Accept” button to consent.</p>

        </div>

          <div className='bg-transparent w-full justify-stretch flex gap-2'>
            <Button className='w-full' onClick={() => handleAccept()}>Accept</Button>
            <Button className='w-full' onClick={() => setIsOpen(!isOpen)}>Customize</Button>
          </div>
        </>
        }
        {isOpen &&
          <>
            <div className='w-full h-full rounded text-sm p-8 max-h-[800px] gap-2 flex flex-col'>
              <div>
                <p className='text-2xl'>
                In this panel you can express some preferences related to the processing of your personal information.
                  
                </p>
                <p className='text-sm opacity-30'>
                  You may review and change expressed choices at any time by resurfacing this panel via the provided link.
                  To deny your consent to the specific processing activities described below, switch the toggles to off or use the “Reject” button
                </p>
              </div>
              <Separator className='bg-white h-px'/>

              <div className='flex gap-2 flex-col overflow-scroll'>
                {consents.map((x) =>{
                  return (
                  <div className='flex flex-col gap-2'>
                    <div className='flex gap-4 justify-between flex-wrap'>
                      <p className='text-xl '>{x.title}</p>
                      <div className='flex gap-2 items-center'>
                        <p>Enabled</p>
                        <Checkbox className='border-2 ' defaultChecked={x.defaultOpen} onCheckedChange={(checked) => handleCheckChange(checked, x.key) }/>
                      </div>
                     
                    </div>
                    <p className='opacity-40'>{x.description}</p>
                    <Separator className='h-px bg-white opacity-40'/>
                  </div>
                  )
                })}
              </div>
              

            </div>

            <div className='bg-transparent w-full justify-stretch flex gap-2'>
              <Button className='w-full' onClick={() => confirmCookies()}>Confirm</Button>
              <Button className='w-full' onClick={() => handleReject()}>Reject</Button>
            </div>
          </>
          
     
        
        }

      </motion.div>
    </div>
  )
}

export default CookieConsent