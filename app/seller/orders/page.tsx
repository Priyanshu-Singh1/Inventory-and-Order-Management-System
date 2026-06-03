import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { Package } from 'lucide-react'

export default async function SellerOrdersPage() {
  const session = await getServerSession(authOptions)
  const sellerId = session?.user?.id

  // Find orders that contain items from this seller's products
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            sellerId
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: {
        where: {
          product: {
            sellerId
          }
        },
        include: {
          product: true
        }
      }
    }
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Received Orders</h1>
        <p className="text-gray-500 mt-1">Orders placed by buyers for your products.</p>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500 shadow-sm border border-gray-100 dark:border-gray-700">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No orders received yet.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Order {order.id.slice(0, 8)}</div>
                  <div className="text-sm text-gray-500">Buyer: {order.user.email} &middot; {order.createdAt.toLocaleString()}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'QUOTATION' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="p-4">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-2 font-medium text-gray-500">Product</th>
                      <th className="pb-2 font-medium text-gray-500">Ordered Qty</th>
                      <th className="pb-2 font-medium text-gray-500">Base Qty</th>
                      <th className="pb-2 font-medium text-gray-500 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <td className="py-3 text-gray-900 dark:text-white font-medium">{item.product.name}</td>
                        <td className="py-3 text-gray-700 dark:text-gray-300">{item.displayQuantity.toString()} {item.displayUnit}</td>
                        <td className="py-3 text-gray-500">{item.orderedBaseQuantity.toString()} {item.product.dimension === 'WEIGHT' ? 'g' : item.product.dimension === 'VOLUME' ? 'mL' : 'item'}</td>
                        <td className="py-3 text-right text-gray-900 dark:text-white font-medium">₹{item.priceAtTimeOfOrder.toString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
