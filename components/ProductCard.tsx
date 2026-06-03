"use client"

import { useState } from 'react'
import { Product, Unit } from '@prisma/client'
import { getAvailableUnits, calculatePrice, formatCurrency } from '@/lib/units'
import { useCart } from '@/components/CartProvider'
import toast from 'react-hot-toast'
import { Plus, Weight, Droplets, Hash, Landmark } from 'lucide-react'

export default function ProductCard({ product }: { product: Product }) {
  const availableUnits = getAvailableUnits(product.dimension)
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedUnit, setSelectedUnit] = useState<Unit>(availableUnits[0])
  const { addItem } = useCart()

  // Calculate live preview price
  const previewPrice = calculatePrice(quantity || 0, selectedUnit, product.price.toString(), product.pricingUnit)

  const handleAddToCart = () => {
    if (quantity <= 0) return toast.error('Please enter a valid quantity')
    
    addItem({
      product,
      quantity,
      unit: selectedUnit
    })
    
    toast.success(`${product.name} added to cart!`)
  }

  // Get dimension specifics
  const getDimensionMeta = () => {
    switch (product.dimension) {
      case 'WEIGHT':
        return {
          color: 'from-emerald-500 to-teal-600',
          bg: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
          icon: <Weight className="w-4 h-4" />
        }
      case 'VOLUME':
        return {
          color: 'from-sky-500 to-indigo-600',
          bg: 'bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border-sky-100 dark:border-sky-900/30',
          icon: <Droplets className="w-4 h-4" />
        }
      case 'COUNT':
        return {
          color: 'from-purple-500 to-violet-600',
          bg: 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/30',
          icon: <Hash className="w-4 h-4" />
        }
    }
  }

  const meta = getDimensionMeta()

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/80 p-6 flex flex-col justify-between h-full hover:shadow-md transition-all duration-300 hover:scale-[1.01] overflow-hidden">
      {/* Decorative gradient top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${meta.color}`} />

      <div className="flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.bg}`}>
            {meta.icon}
            <span className="capitalize">{product.dimension.toLowerCase()}</span>
          </span>
        </div>
        
        {product.description ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        ) : (
          <p className="text-sm text-slate-400 dark:text-slate-500 italic mb-4">
            No description provided.
          </p>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700/80">
        {/* Pricing Rate Tag */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-md">
            <Landmark className="w-4 h-4" />
          </div>
          <div className="text-sm">
            <span className="text-slate-400 dark:text-slate-500">Rate: </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              ₹{product.price.toString()} / {product.pricingUnit}
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">
              Quantity
            </label>
            <input 
              type="number" 
              min="0.0001" 
              step="any"
              value={quantity} 
              onChange={e => setQuantity(e.target.value === '' ? 0 : parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
            />
          </div>
          <div className="w-24">
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">
              Unit
            </label>
            <select 
              value={selectedUnit}
              onChange={e => setSelectedUnit(e.target.value as Unit)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
            >
              {availableUnits.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Cost & Add CTA */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700/80">
          <div className="text-sm">
            <span className="text-slate-400 dark:text-slate-500">Preview: </span>
            <div className="font-extrabold text-lg text-slate-900 dark:text-white">
              ₹{formatCurrency(previewPrice.toString()).replace(' INR', '')}
            </div>
          </div>
          <button 
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
