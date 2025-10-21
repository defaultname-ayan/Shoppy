import React from 'react'

const Foot = ({ font }) => {
  return (
    <footer className={`w-full bg-gradient-to-t from-stone-950 to-stone-900 rounded-t-2xl border-t border-stone-700 ${font}`}>
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 p-10 md:p-16 max-w-7xl mx-auto">
        
        {/* Left Section - Navigation Links */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 flex-1">
          {/* Main Links */}
          <div className="flex flex-col gap-2">
            <h3 className="text-stone-400 text-sm font-semibold mb-2 uppercase tracking-wider">
              Navigation
            </h3>
            <button className="text-white text-left py-2 hover:text-green-500 transition-all duration-300 relative group w-fit">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="text-white text-left py-2 hover:text-green-500 transition-all duration-300 relative group w-fit">
              Add Product
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="text-white text-left py-2 hover:text-green-500 transition-all duration-300 relative group w-fit">
              Collections
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="text-white text-left py-2 hover:text-green-500 transition-all duration-300 relative group w-fit">
              Login
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* Additional Links */}
          <div className="flex flex-col gap-2">
            <h3 className="text-stone-400 text-sm font-semibold mb-2 uppercase tracking-wider">
              About
            </h3>
            <button className="text-white text-left py-2 hover:text-green-500 transition-all duration-300 relative group w-fit">
              About Developer
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="text-white text-left py-2 hover:text-green-500 transition-all duration-300 relative group w-fit">
              Contact Me
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="text-white text-left py-2 hover:text-green-500 transition-all duration-300 relative group w-fit">
              GitHub
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
        </div>

        {/* Right Section - Logo */}
        <div className="flex items-center justify-center md:justify-end">
          <img 
            src="/S-bg-fr.png" 
            alt="Shoppy Logo" 
            className="h-32 w-auto md:h-40 opacity-20 hover:opacity-30 transition-opacity duration-300"
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800 py-6 px-10 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm">
            © 2025 Shoppy. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button className="text-stone-500 text-sm hover:text-green-500 transition-colors duration-300">
              Privacy Policy
            </button>
            <button className="text-stone-500 text-sm hover:text-green-500 transition-colors duration-300">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Foot
