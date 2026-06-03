import prisma from '@/lib/prisma'
import { Package } from 'lucide-react'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { seller: true }
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Products</h1>
        <p className="text-gray-500 mt-1">View all products listed by sellers on the platform.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Seller</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Dimension</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Price (INR)</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Stock (Base Unit)</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p>No products on the platform yet.</p>
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{product.seller.email}</td>
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
