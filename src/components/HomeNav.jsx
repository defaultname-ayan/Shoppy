"use client"
import React from 'react'
import { Instrument_Serif } from 'next/font/google'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
})

const HomeNav = () => {
  return (
    <div
      className={`flex justify-between items-center px-8 py-4 bg-black border-b border-white text-white m-0 ${instrumentSerif.className}`}
    >
      
      <div className="flex items-center space-x-2">
        <img
          src="/S-bg-fr.png"
          alt="logo"
          className="h-16 w-auto pr-1 border-r border-white"
        />
        <p className="text-2xl tracking-wide pl-4 ">Shoppy</p>
      </div>

      
      <div className="flex items-center space-x-4 md:space-x-6 text-lg md:text-xl">
        {[
          { label: 'About Developer', link: '/about' },
          { label: 'My Collection', link: '/collection' },
          { label: 'Login', link: '/login' }
        ].map((item, index) => (
          <React.Fragment key={item.label}>
            <button 
              className="relative group min-h-[44px] px-2 touch-manipulation select-none"
              onClick={() => window.location.href = item.link}
              onTouchStart={(e) => e.stopPropagation()}
              style={{ touchAction: 'manipulation' }}
            >
              <span className="transition-colors duration-300 group-hover:text-gray-200">
                {item.label}
              </span>
              
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-white transition-all duration-300 ease-out group-hover:w-full"></span>
            </button>
            {index < 2 && <span className="text-white hidden md:inline">|</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default HomeNav