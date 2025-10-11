"use client"
import Navbar from '@/components/Navbar'
import ProdCard from '@/components/ProdCard'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Instrument_Serif } from 'next/font/google'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
})

const Page = () => {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  // Memoized fetch function to prevent unnecessary re-creation
  const fetchUserAndProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Check authentication first
      const authRes = await fetch("/api/auth/me", {
        credentials: 'include',
        cache: 'no-store' // Ensure fresh auth data
      })
      
      if (!authRes.ok) {
        router.push('/login')
        return
      }

      const authData = await authRes.json()
      setUser(authData.user)

      // Fetch products immediately after successful auth
      const productsRes = await fetch("/api/products", {
        credentials: 'include'
      })

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      } else if (productsRes.status === 401) {
        router.push('/login')
        return
      } else {
        setError('Failed to fetch products')
      }
    } catch (error) {
      console.error('Auth/Products fetch failed:', error)
      setError('Connection error')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchUserAndProducts()
  }, [fetchUserAndProducts])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-black to-stone-950 min-h-screen text-white">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-black to-stone-950 min-h-screen text-white">
        <div className="text-red-400 text-xl mb-4">{error}</div>
        <button 
          onClick={fetchUserAndProducts}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-black to-stone-950 min-h-screen text-white">
      <Navbar />
      
      {/* Header with responsive plus button */}
      <div className='flex flex-row items-center justify-center gap-4 mt-6 md:mt-10'>
        {/* Responsive header */}
        <h1 className={`text-3xl md:text-4xl font-light text-center ${instrumentSerif.className}`}>
          Collection
        </h1>
        
        {/* Plus button - only visible on mobile */}
<button 
  onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()
    router.push('/add')
  }}
  onTouchStart={(e) => e.stopPropagation()}
  className='block md:hidden w-12 h-12 rounded-full bg-stone-900 shadow-[inset_0_1px_2px_#ffffff50,0_2px_4px_#00000030,0_4px_8px_#00000015] hover:bg-green-600 active:bg-green-700 transition-all duration-200 flex items-center justify-center text-white text-xl font-bold cursor-pointer touch-manipulation select-none'
  style={{ touchAction: 'manipulation' }}
>
  +
</button>

      </div>

      {/* Responsive container */}
      <div className="w-full max-w-7xl px-4 md:px-6 lg:px-8">
        {products.length > 0 ? (
          <div className="flex flex-col items-center">
            {/* Mobile-first responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 mt-8 md:mt-12 w-full justify-items-center">
              {products.map((product) => (
                <ProdCard key={product._id} data={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center mt-16 md:mt-20">
            <p className="text-stone-400 text-lg text-center px-4">No products found in your collection</p>
          </div>
        )}
      </div>

      {/* Bottom spacing for mobile */}
      <div className="pb-8 md:pb-12"></div>
    </div>
  )
}

export default Page
