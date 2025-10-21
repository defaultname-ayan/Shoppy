"use client"
import React from 'react'
import ProdCard from './../components/ProdCard.jsx'
import LightRays from '@/components/LightRays.jsx'
import Navbar from '@/components/Navbar.jsx'
import { ArrowRight, Copy, LogIn, FileText, CheckCircle2, Link2, Sparkles, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DM_Serif_Display, Instrument_Serif } from 'next/font/google'
import {Sacramento} from 'next/font/google'
import CurvedLoop from '@/components/CurvedLoop.jsx'
import Foot from '@/components/foot.jsx'

const sacramento = Sacramento({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-sacramento',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'], 
  variable: '--font-instrument-serif',
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
})

const page = () => {
  const router = useRouter()

  const steps = [
    { number: 1, icon: Copy, title: 'Copy Link', description: 'Copy the product link from any website' },
    { number: 2, icon: LogIn, title: 'Login', description: 'Sign in to your Shoppy account' },
    { number: 3, icon: FileText, title: 'Paste Link', description: 'Paste the link in Add Product' },
    { number: 4, icon: CheckCircle2, title: 'Voilà Done!', description: 'Your product is saved' },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className='flex flex-col justify-center items-center flex-1 w-full bg-gradient-to-b from-black to-stone-950 px-4 mb-20'>
        <div>
          <img 
            src="/S-bg-fr.png" 
            alt="Shoppy logo" 
            className="h-16 w-auto sm:h-24 md:h-40"
          />
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className={`font-extrabold ${instrumentSerif.className} text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight`}> 
            <span className="relative inline-block">
              <span className={`relative z-10 ${sacramento.className} text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white px-2 sm:px-4 pb-1 sm:pb-2`}>
                Shoppy
              </span>
            </span>
            <span className="text-white">, </span>
            <br/> 
            <span className="text-white">A easier wishlist </span>
            <span className="text-white">for clothing.</span>
          </h1>
        </div>

        <button 
          onClick={() => router.push('/login')}
          onTouchStart={(e) => e.stopPropagation()}
          className={`bg-white ${dmSerifDisplay.className} border-white border-2 rounded-2xl sm:rounded-3xl p-3 px-6 sm:p-2 sm:px-4 text-black text-lg sm:text-xl hover:bg-black hover:text-green-600 transition-all duration-300 ease-in min-h-[48px] touch-manipulation select-none`}
          style={{ touchAction: 'manipulation' }}>
          Get Started.
        </button>
      </div>

      <div className='min-h-screen bg-gradient-to-b from-stone-950 to-black py-20 px-4 md:px-10'>
        <div className={`text-white ${instrumentSerif.className} max-w-6xl mx-auto`}>
          <p className='font-bold text-3xl md:text-5xl mb-12 text-center'>Find something you like?</p>
          
          <div className='relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 mb-20'>
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <React.Fragment key={step.number}>
                  <div className='flex md:flex-col items-center md:items-center gap-4 md:gap-6 flex-1'>
                    <div className='flex flex-col items-center'>
                      <div className='rounded-full bg-gradient-to-br from-stone-700 to-stone-800 border-2 border-stone-600 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-2 md:mb-4 shadow-lg'>
                        <Icon size={28} className='text-white' />
                      </div>
                      <div className='rounded-full bg-stone-700 border border-stone-600 w-8 h-8 flex items-center justify-center text-sm font-bold'>
                        {step.number}
                      </div>
                    </div>
                    
                    <div className='flex-1 md:text-center'>
                      <p className='text-xl md:text-2xl font-semibold mb-2'>{step.title}</p>
                      <p className='text-stone-400 text-sm md:text-base'>{step.description}</p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className='hidden md:flex items-center justify-center flex-shrink-0 px-4'>
                      <ArrowRight size={32} className='text-stone-600' />
                    </div>
                  )}
                  
                  {index < steps.length - 1 && (
                    <div className='md:hidden absolute left-7 top-20 w-0.5 h-24 bg-gradient-to-b from-stone-600 to-transparent' 
                         style={{ top: `${(index * 156) + 80}px` }} />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          <div className='mt-32 mb-10'>
            <h2 className='text-3xl md:text-4xl font-bold text-center mb-16'>How It Works</h2>
            
            <div className='flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 max-w-5xl mx-auto'>
              <div className='bg-gradient-to-br from-stone-900 to-stone-950 rounded-2xl p-8 border border-stone-700 shadow-[inset_0_1px_2px_#ffffff20,0_4px_12px_#00000040] flex-1 hover:border-green-500/50 transition-all duration-300 group'>
                <div className='flex flex-col items-center text-center'>
                  <div className='bg-green-500/10 p-4 rounded-full mb-4 group-hover:bg-green-500/20 transition-all'>
                    <Link2 size={32} className='text-green-500' />
                  </div>
                  <h3 className='text-xl font-semibold mb-2'>Paste Link</h3>
                  <p className='text-stone-400 text-sm'>Copy any product URL from your favorite store</p>
                </div>
              </div>

              <ArrowRight size={40} className='text-stone-600 rotate-90 md:rotate-0' />

              <div className='bg-gradient-to-br from-stone-900 to-stone-950 rounded-2xl p-8 border border-stone-700 shadow-[inset_0_1px_2px_#ffffff20,0_4px_12px_#00000040] flex-1 hover:border-purple-500/50 transition-all duration-300 group'>
                <div className='flex flex-col items-center text-center'>
                  <div className='bg-purple-500/10 p-4 rounded-full mb-4 group-hover:bg-purple-500/20 transition-all'>
                    <Sparkles size={32} className='text-purple-500' />
                  </div>
                  <h3 className='text-xl font-semibold mb-2'>Custom AI Parser</h3>
                  <p className='text-stone-400 text-sm'>Our AI extracts product details automatically</p>
                </div>
              </div>

              <ArrowRight size={40} className='text-stone-600 rotate-90 md:rotate-0' />

              <div className='bg-gradient-to-br from-stone-900 to-stone-950 rounded-2xl p-8 border border-stone-700 shadow-[inset_0_1px_2px_#ffffff20,0_4px_12px_#00000040] flex-1 hover:border-blue-500/50 transition-all duration-300 group'>
                <div className='flex flex-col items-center text-center'>
                  <div className='bg-blue-500/10 p-4 rounded-full mb-4 group-hover:bg-blue-500/20 transition-all'>
                    <CreditCard size={32} className='text-blue-500' />
                  </div>
                  <h3 className='text-xl font-semibold mb-2'>Product Card</h3>
                  <p className='text-stone-400 text-sm'>Beautiful card created in your collection</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
        <div>
           <Foot font={instrumentSerif.className} />
        </div>
      
            

    </div>
  )
}

export default page
