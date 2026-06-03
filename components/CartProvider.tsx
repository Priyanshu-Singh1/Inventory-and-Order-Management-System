"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product, Unit } from '@prisma/client'

export type CartItem = {
  product: Product
  quantity: number
  unit: Unit
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  
  // Persist to local storage
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load cart')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (newItem: CartItem) => {
    setItems(current => {
      const existing = current.find(i => i.product.id === newItem.product.id)
      if (existing) {
        // If same product exists, we could merge quantities, but let's replace for simplicity
        // or just add if they are different units. Let's just replace.
        return current.map(i => i.product.id === newItem.product.id ? newItem : i)
      }
      return [...current, newItem]
    })
  }

  const removeItem = (productId: string) => {
    setItems(current => current.filter(i => i.product.id !== productId))
  }

  const clearCart = () => setItems([])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
