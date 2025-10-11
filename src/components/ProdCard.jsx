"use client"
import React from "react"
import { Instrument_Serif } from "next/font/google"
import { DM_Serif_Display } from 'next/font/google'

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
})

const ProdCard = ({ data }) => {
  const { name, price, images, category, url } = data
  
  const urlClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (url && url !== "") {
      window.open(url, "_blank")
    } else {
      alert("No URL available for this product.")
    }
  }
  
  const getBrandName = (url) => {
    if (!url) return "—"
    try {
      const hostname = new URL(url).hostname 
      const cleanHost = hostname
        .replace("www.", "") 
        .split(".")[0] 
      return cleanHost.charAt(0).toUpperCase() + cleanHost.slice(1)
    } catch {
      return "—"
    }
  }

  return (
    <div className="bg-stone-900 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-[inset_0_1px_2px_#ffffff50,0_2px_4px_#00000030,0_4px_8px_#00000015] w-full max-w-xs md:max-w-sm mx-auto transform transition-all duration-200 hover:scale-105 hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)]">
      {/* Responsive image container */}
      <div className="w-full aspect-square mb-4 overflow-hidden rounded-xl md:rounded-2xl border-2 md:border-4 border-stone-500">
        <img
          src={images?.[0] || "/S-bg-fr.png"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
        />
      </div>
      
      {/* Product details */}
      <div className="space-y-1 md:space-y-2">
        <h1 className={`${dmSerifDisplay.className} font-extrabold text-lg md:text-xl text-white line-clamp-2`}>
          {name}
        </h1>
        
        <p className={`${dmSerifDisplay.className} font-mono text-base md:text-lg text-green-400 font-semibold`}>
          {price ? `₹${price}` : "—"}
        </p>

        <p className={`${dmSerifDisplay.className} font-extralight text-sm md:text-base text-stone-300`}>
          Brand: {url ? getBrandName(url) : "—"}
        </p>
      </div>

      {/* Action buttons - responsive layout */}
      <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 mt-4 md:mt-6">
        <div className="shadow-[inset_0_1px_2px_#ffffff50,0_2px_4px_#00000030,0_4px_8px_#00000015] bg-stone-700 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-mono text-stone-200 pointer-events-none select-none">
          {category || "Uncategorized"}
        </div>
        
        <button 
          onClick={urlClick}
          onTouchStart={(e) => e.stopPropagation()}
          className="shadow-[inset_0_1px_2px_#ffffff50,0_2px_4px_#00000030,0_4px_8px_#00000015] text-xs md:text-sm font-mono bg-stone-600 hover:bg-green-600 active:bg-green-700 px-3 py-1 md:px-4 md:py-1.5 rounded-full transition-all duration-200 text-white cursor-pointer touch-manipulation select-none min-h-[32px] min-w-[80px] flex items-center justify-center"
          style={{ touchAction: 'manipulation' }}
        >
          Buy now
        </button>
      </div>
    </div>
  )
}

export default ProdCard
