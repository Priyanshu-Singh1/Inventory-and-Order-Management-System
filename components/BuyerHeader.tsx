"use client"

import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import { ShoppingCart, LogOut, Bell } from 'lucide-react'

interface BuyerHeaderProps {
  userEmail: string
}

export default function BuyerHeader({ userEmail }: BuyerHeaderProps) {
  const { items } = useCart()
  const cartCount = items.length

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 md:px-8 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent hidden md:block">
          Marketplace Catalog
        </h1>
      </div>
      
      <div className="flex items-center gap-6 ml-auto">
        {/* Live Cart Counter */}
        <Link 
          href="/buyer/cart" 
          className="relative p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-all"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-800 animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>

        <button className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-800" />
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed In As</p>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{userEmail}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            {userEmail.slice(0, 2).toUpperCase()}
          </div>
          
          <a href="/api/auth/signout" className="p-2 text-slate-400 hover:text-red-500 md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors">
            <LogOut className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  )
}
