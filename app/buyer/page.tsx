import prisma from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { Package, Search } from 'lucide-react'
import { Dimension } from '@prisma/client'
import Link from 'next/link'

export default async function BuyerCatalogPage({
  searchParams,
}: {
  searchParams?: { query?: string; category?: string };
}) {
  const query = searchParams?.query || ''
  const category = searchParams?.category as Dimension | undefined

  // Safe fallback if searchParams resolves asynchronously in Next.js 15
  // We await it safely
  const resolvedParams = await searchParams

  const safeQuery = resolvedParams?.query || ''
  const safeCategory = resolvedParams?.category as Dimension | undefined

  const products = await prisma.product.findMany({
    where: {
      name: { contains: safeQuery, mode: 'insensitive' },
      ...(safeCategory ? { dimension: safeCategory } : {}),
    },
    orderBy: { name: 'asc' },
    include: {
      seller: true
    }
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Catalog</h1>
        <p className="text-gray-500 mt-1">Browse and filter products from all sellers.</p>
      </div>

      <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <form className="flex flex-col sm:flex-row gap-4" method="GET" action="/buyer">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              name="query"
              defaultValue={safeQuery}
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
          <select 
            name="category" 
            defaultValue={safeCategory || ''}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="WEIGHT">Weight (g, kg)</option>
            <option value="VOLUME">Volume (mL, L)</option>
            <option value="COUNT">Items (Count)</option>
          </select>
          <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
            Filter
          </button>
          {(safeQuery || safeCategory) && (
            <Link href="/buyer" className="px-6 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg font-medium transition-colors text-center">
              Clear
            </Link>
          )}
        </form>
      </div>

      {products.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center text-gray-500 shadow-sm border border-gray-100 dark:border-gray-700">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No products found</h3>
          <p>Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
