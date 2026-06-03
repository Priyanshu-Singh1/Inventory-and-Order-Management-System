import prisma from '@/lib/prisma'
import { Package, ListOrdered, Users, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const totalProducts = await prisma.product.count()
  const totalOrders = await prisma.order.count()
  const totalSellers = await prisma.user.count({ where: { role: 'SELLER' } })
  const totalBuyers = await prisma.user.count({ where: { role: 'BUYER' } })

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: {
        include: {
          product: {
            include: { seller: true }
          }
        }
      }
    }
  })

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-lg shadow-indigo-950/20 border border-slate-800">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2 flex items-center gap-2">
          <Shield className="w-7 h-7 text-indigo-400" />
          Platform Administration
        </h2>
        <p className="text-indigo-200 text-sm md:text-base max-w-2xl leading-relaxed">
          Monitor marketplace operations, review catalog products listed by merchants, inspect buyer orders, and audit system users.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/80 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Products</p>
            <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-0.5">{totalProducts}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/80 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <ListOrdered className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-0.5">{totalOrders}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/80 flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Sellers</p>
            <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-0.5">{totalSellers}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/80 flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Buyers</p>
            <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-0.5">{totalBuyers}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/80 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700/80 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Marketplace Orders</h3>
          <Link href="/admin/orders" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50">
                <th className="p-4 font-semibold text-xs text-slate-450 dark:text-slate-400 uppercase tracking-wider">Order ID</th>
                <th className="p-4 font-semibold text-xs text-slate-450 dark:text-slate-400 uppercase tracking-wider">Buyer Account</th>
                <th className="p-4 font-semibold text-xs text-slate-450 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold text-xs text-slate-450 dark:text-slate-400 uppercase tracking-wider">Total Amount</th>
                <th className="p-4 font-semibold text-xs text-slate-450 dark:text-slate-400 uppercase tracking-wider">Date Placed</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No orders have been placed on the platform yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="border-t border-slate-100 dark:border-slate-700/80 hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition-colors">
                    <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-300">
                      {order.id.slice(0, 8).toUpperCase()}...
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {order.user.email}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        order.status === 'QUOTATION' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30' :
                        order.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30' :
                        'bg-slate-50 text-slate-700 dark:bg-slate-950/20 dark:text-slate-400 border border-slate-100 dark:border-slate-900/30'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">
                      ₹{order.totalAmount.toString()}
                    </td>
                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
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
