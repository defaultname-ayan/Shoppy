"use client"
import React, { useRef } from 'react'
import Navbar from '@/components/Navbar.jsx'
import { ArrowRightIcon } from 'lucide-react'
import { useState, useEffect, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Instrument_Serif } from 'next/font/google'
import gsap from 'gsap'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
})

const page = () => {
  const [input, setInput] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const router = useRouter()
  
  // Refs for GSAP animations
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const formRef = useRef(null)
  const messageRef = useRef(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          router.push('/login')
          return
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
        return
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  // GSAP Animations
  useLayoutEffect(() => {
    if (!loading && titleRef.current && formRef.current) {
      // Set initial states
      gsap.set(titleRef.current, { opacity: 0, y: 50 })
      gsap.set(formRef.current, { opacity: 0, y: 30, scale: 0.95 })

      // Create animation timeline
      const tl = gsap.timeline()
      
      // Title animation - split text effect
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
      })
      
      // Form animation
      .to(formRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6")

      // Cleanup function
      return () => {
        tl.kill()
      }
    }
  }, [loading])

  // Message animation
  useLayoutEffect(() => {
    if (message && messageRef.current) {
      const animation = gsap.fromTo(messageRef.current, 
        { 
          opacity: 0, 
          y: 20,
          scale: 0.9 
        }, 
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)"
        }
      )

      // Cleanup function
      return () => {
        animation.kill()
      }
    }
  }, [message])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await fetch("/api/parser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Product added successfully!")
        setInput('')
        // Auto redirect after success message
        setTimeout(() => {
          router.push('/collection')
        }, 2000)
      } else {
        setMessage(data.error || "Failed to add product")
      }
      console.log("Parsed Data:", data);
    } catch (err) {
      console.error("Error fetching:", err);
      setMessage("Network error. Please try again.")
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-black to-stone-950 min-h-screen text-white">
        <div className="text-xl animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-stone-950">
      <Navbar />
      
      <div 
        ref={containerRef}
        className="flex flex-col justify-center items-center min-h-screen w-full px-4 py-8 md:py-0"
      >
        {/* Responsive Title */}
        <h1 
          ref={titleRef}
          className={`${instrumentSerif.className} text-white font-extralight text-center leading-tight mb-8 md:mb-10
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
            max-w-4xl px-2
          `}
        >
          What's the Save for today?
        </h1>
        
        {/* Responsive Form Container */}
        <div 
          ref={formRef}
          className="relative flex flex-col sm:flex-row justify-center items-center w-full max-w-2xl gap-4 sm:gap-0"
        >
          {/* Input Field */}
          <input 
            type="search" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste Product Link Here" 
            className="bg-stone-900 p-3 md:p-4 rounded-2xl md:rounded-3xl w-full text-white font-mono font-extralight 
              text-base md:text-lg shadow-[inset_0_1px_2px_#ffffff50,0_2px_4px_#00000030,0_4px_8px_#00000015] 
              focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)]
              transition-all duration-200
              pr-12 sm:pr-16
            "
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
          
          {/* Submit Button */}
          <button 
            onClick={handleSubmit}
            className="absolute right-2 sm:right-2 top-1/2 transform -translate-y-1/2
              bg-black p-2 md:p-3 rounded-2xl md:rounded-3xl 
              shadow-[inset_0_1px_2px_#ffffff50,0_2px_4px_#00000030,0_4px_8px_#00000015] 
              hover:scale-105 active:scale-90 transition-all duration-200 ease-in-out 
              hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            disabled={!input.trim()}
          >
            <ArrowRightIcon className="text-white" size={15} />
          </button>
        </div>
        
        {/* Message Display */}
        {message && (
          <div 
            ref={messageRef}
            className={`mt-6 p-3 md:p-4 rounded-xl max-w-md w-full text-center text-sm md:text-base transition-all duration-200 ${
              message.includes('successfully') 
              ? 'bg-green-500/20 text-green-400 border border-green-400/20' 
              : 'bg-red-500/20 text-red-400 border border-red-400/20'
            }`}
          >
            {message}
          </div>
        )}
        
        {/* Subtle instruction text */}
        <p className="text-stone-500 text-xs md:text-sm mt-4 text-center max-w-md px-4">
          Paste any product URL and we'll extract the details for your collection
        </p>
      </div>
    </div>
  )
}

export default page
