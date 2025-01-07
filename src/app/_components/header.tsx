'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "~/lib/utils"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", isScrolled ? "bg-white/50 backdrop-blur-sm shadow-md" : "bg-transparent")}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-black">SocialRAG</Link>
          <div className="space-x-4">
            <Link href="#analytics" className="text-gray-600 hover:text-black transition-colors">Analytics</Link>
            <Link href="#chat" className="text-gray-600 hover:text-black transition-colors">Chat</Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
