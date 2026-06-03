"use client"

import { useState } from 'react'
import { Dimension, Unit } from '@prisma/client'
import { getAvailableUnits, getBaseUnit } from '@/lib/units'
import { createProduct } from '@/app/actions/products'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
  const [dimension, setDimension] = useState<Dimension>('WEIGHT')
  const availableUnits = getAvailableUnits(dimension)
  const baseUnit = getBaseUnit(dimension)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      const res = await createProduct(formData)
      if (res.success) {
        toast.success('Product created successfully!')
        router.push('/seller/products')
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create product')
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/seller/products" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 mb-4 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to My Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
        <p className="text-gray-500 mt-1">Configure pricing and initial inventory for your product.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
              <input required name="name" type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="e.g., Premium Sugar" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea name="description" rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="Product details..."></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dimension Category</label>
              <select
                name="dimension"
                value={dimension}
                onChange={(e) => setDimension(e.target.value as Dimension)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 dark:text-white"
              >
                <option value="WEIGHT">Weight</option>
                <option value="VOLUME">Volume</option>
                <option value="COUNT">Count/Items</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Inventory (in Base Unit: {baseUnit})</label>
              <input required name="inventoryQuantity" type="number" step="0.01" min="0" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder={`e.g., 5000 (meaning 5000 ${baseUnit})`} />
              <p className="text-xs text-gray-500">Inventory is always stored in the base unit.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (INR)</label>
              <input required name="price" type="number" step="0.01" min="0" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="e.g., 50.00" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pricing Unit</label>
              <select name="pricingUnit" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 dark:text-white">
                {availableUnits.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500">The rate at which the price applies.</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
