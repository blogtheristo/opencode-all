'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/80">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            <span className="text-green-600">Lifetime</span> Oy
          </Link>
        </div>

        <div className="hidden md:flex md:items-center md:gap-8">
          <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            About
          </Link>
          <Link href="https://dws10.com" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            DWS IQ Platform
          </Link>
          <Link href="/impact" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Impact
          </Link>
          <Link href="/team" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Team
          </Link>
          <Link href="/investors" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Investors
          </Link>
          <Button asChild>
            <Link href="/contact">Contact</Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link href="/about" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              About
            </Link>
            <Link href="https://dws10.com" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              DWS IQ Platform
            </Link>
            <Link href="/impact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Impact
            </Link>
            <Link href="/team" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Team
            </Link>
            <Link href="/investors" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Investors
            </Link>
            <Button className="w-full" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
