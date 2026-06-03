import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import Link from 'next/link'
import { Plus, Package } from 'lucide-react'

export default async function SellerProductsPage() {
  const session = await getServerSession(authOptions)

  const products = await prisma.product.findMany({
    where: { sellerId: session?.user?.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Products</h1>
          <p className="text-gray-500 mt-1">Manage your inventory and product catalogue.</p>
        </div>
        <Link
          href="/seller/products/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Dimension</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Price (INR)</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Stock (Base Unit)</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p>No products yet. Add your first product to get started.</p>
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{product.dimension}</td>
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      ₹{product.price.toString()} / {product.pricingUnit}
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                      {product.inventoryQuantity.toString()}
                      {product.dimension === 'WEIGHT' ? ' g' : product.dimension === 'VOLUME' ? ' mL' : ' items'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
