"use client"
import React from "react"
import { Instrument_Serif } from "next/font/google"
import { DM_Serif_Display } from 'next/font/google'
import { Trash } from "lucide-react"
import { SquareArrowOutUpRight } from 'lucide-react';

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
  
  const handleRemove = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // ✅ Add confirmation dialog for better UX
    if (!confirm("Are you sure you want to remove this product?")) {
      return
    }
    
    try {
      // ✅ Updated to use /api/delete endpoint
      const res = await fetch("/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // ✅ Add authorization header if you have auth tokens
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        },  
        body: JSON.stringify({ productId: data._id }),
      })
      
      // ✅ Better error handling with response data
      if (res.ok) {
        const result = await res.json()
        if (result.success) {
          // ✅ Better user feedback
          alert("Product removed successfully!")
          window.location.reload()
        } else {
          alert(result.message || "Failed to remove product.")
        }
      } else {
        const errorData = await res.json().catch(() => ({}))
        alert(errorData.message || "Failed to remove product.")
      }
    } catch (error) {
      console.error("Error removing product:", error)
      alert("Network error. Please try again.")
    }
  } // ✅ Fixed missing closing brace

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
    <div className="bg-stone-900 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-[inset_0_1px_2px_#ffffff50,0_2px_4px_#00000030,0_4px_8px_#00000015] w-full max-w-xs md:max-w-sm mx-auto transform transition-all duration-200">
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
        <div className="shadow-[inset_0_1px_2px_#ffffff50,0_2px_4px_#00000030,0_4px_8px_#00000015] bg-stone-700 px-2 py-1 rounded-full text-xs font-mono text-stone-200 pointer-events-none select-none inline-block">
  {category || "Uncategorized"}
</div>
      </div>

      {/* Action buttons - responsive layout */}
      <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 mt-4 md:mt-6">
        <button 
          onClick={handleRemove}
          onTouchStart={(e) => e.stopPropagation()}
          className=" text-red-500 shadow-[inset_0_1px_2px_#ffffff50,0_2px_4px_#00000030,0_4px_8px_#00000015] text-sm md:text-sm font-mono bg-stone-600 hover:bg-red-300 active:bg-green-700 px-4 py-2 md:px-4 md:py-1.5 rounded-full transition-all duration-200  cursor-pointer touch-manipulation select-none min-h-[44px] min-w-[100px] flex items-center justify-center"
          style={{ touchAction: 'manipulation' }}
        >
          <Trash color="#fb2c36" className="mr-1 h-4 w-4" />
          Remove
        </button>
        <button 
          onClick={urlClick}
          onTouchStart={(e) => e.stopPropagation()}
          className="shadow-[inset_0_1px_2px_#ffffff50,0_2px_4px_#00000030,0_4px_8px_#00000015] text-sm md:text-sm font-mono bg-stone-600 hover:bg-green-600 active:bg-green-700 px-4 py-2 md:px-4 md:py-1.5 rounded-full transition-all duration-200 text-white cursor-pointer touch-manipulation select-none min-h-[44px] min-w-[100px] flex items-center justify-center"
          style={{ touchAction: 'manipulation' }}
        >
          <SquareArrowOutUpRight className="mr-1 h-4 w-4" />
          Link
        </button>
      </div>
    </div>
  )
}

export default ProdCard
