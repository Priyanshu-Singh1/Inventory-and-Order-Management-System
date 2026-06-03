"use client"

import { useCart } from '@/components/CartProvider'
import { calculatePrice, formatCurrency } from '@/lib/units'
import { placeOrder } from '@/app/actions/orders'
import { useState } from 'react'
import { Trash2, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function BuyerCartPage() {
  const { items, removeItem, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const calculateTotal = () => {
    let total = 0
    items.forEach(item => {
      const price = calculatePrice(item.quantity, item.unit, item.product.price.toString(), item.product.pricingUnit)
      total += price.toNumber()
    })
    return total
  }

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)

    try {
      const orderData = items.map(i => ({
        productId: i.product.id,
        quantity: i.quantity,
        unit: i.unit
      }))

      await placeOrder(orderData)
      toast.success('Order placed successfully!')
      clearCart()
      router.push('/buyer/orders')
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-indigo-600" />
          My Cart
        </h1>
        <p className="text-gray-500 mt-1">Review your selected items before placing an order.</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center text-gray-500 shadow-sm border border-gray-100 dark:border-gray-700">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Product</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Quantity</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Rate</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Price</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const price = calculatePrice(item.quantity, item.unit, item.product.price.toString(), item.product.pricingUnit)
                return (
                  <tr key={item.product.id} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{item.product.name}</td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">{item.quantity} {item.unit}</td>
                    <td className="p-4 text-gray-500 text-sm">{item.product.price.toString()} / {item.product.pricingUnit}</td>
                    <td className="p-4 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(price.toString())}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => removeItem(item.product.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              Total: {formatCurrency(calculateTotal())}
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
