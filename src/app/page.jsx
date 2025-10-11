"use client"
import React from 'react'
import ProdCard from './../components/ProdCard.jsx'
import LightRays from '@/components/LightRays.jsx'
import Navbar from '@/components/Navbar.jsx'
import { ArrowBigRightIcon, ArrowRightCircle, ArrowRightIcon, Home, Search, SearchCheck } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DM_Serif_Display, Instrument_Serif } from 'next/font/google'
import {Sacramento} from 'next/font/google'
import HomeNav from '@/components/HomeNav.jsx'

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

  return (
    <div className="flex flex-col h-screen">
      <HomeNav />
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
          className={`bg-white ${dmSerifDisplay.className} border-white border-2 rounded-2xl sm:rounded-3xl p-2 px-4 sm:p-1 sm:px-3 text-black text-lg sm:text-xl hover:bg-black hover:text-green-600 transition-all duration-300 ease-in`}>
          Get Started.
        </button>
      </div>
    </div>
  )
}

export default page