import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { Package, ListOrdered, PlusCircle, LayoutGrid, Scale, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export default async function SellerDashboard() {
  const session = await getServerSession(authOptions)
  const sellerId = session?.user?.id

  const totalProducts = await prisma.product.count({
    where: { sellerId }
  })

  // Orders that contain at least one item from this seller's products
  const receivedOrders = await prisma.order.count({
    where: {
      items: {
        some: {
          product: {
            sellerId
          }
        }
      }
    }
  })

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 text-white shadow-lg shadow-emerald-600/10">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Welcome Back to your Store!</h2>
        <p className="text-emerald-100 text-sm md:text-base max-w-2xl leading-relaxed">
          Manage your catalogue, track incoming customer orders, and configure pricing rates in INR with high decimal precision.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/80 flex items-center gap-5">
          <div className="p-4 bg-emerald-55/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-50 dark:border-emerald-950/20">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Active Catalogue</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalProducts}</p>
            <p className="text-xs text-slate-500 mt-1">Listed products for sale</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/80 flex items-center gap-5">
          <div className="p-4 bg-teal-55/10 text-teal-600 dark:text-teal-400 rounded-2xl border border-teal-50 dark:border-teal-950/20">
            <ListOrdered className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Received Orders</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{receivedOrders}</p>
            <p className="text-xs text-slate-500 mt-1">Quotations placed by buyers</p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Store Policy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/80 lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-emerald-500" />
            Quick Store Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/seller/products/new"
              className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl hover:bg-emerald-50/10 dark:hover:bg-slate-700/30 transition-all group"
            >
              <PlusCircle className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block font-semibold text-sm text-slate-900 dark:text-white">Add Product</span>
                <span className="block text-xs text-slate-550 dark:text-slate-455">Configure unit and price rates</span>
              </div>
            </Link>

            <Link
              href="/seller/products"
              className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl hover:bg-emerald-50/10 dark:hover:bg-slate-700/30 transition-all group"
            >
              <Package className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block font-semibold text-sm text-slate-900 dark:text-white">Manage Catalogue</span>
                <span className="block text-xs text-slate-550 dark:text-slate-455">Update stock and listings</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Store Policy / Conversion Guide */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/80 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-500" />
            Conversion Guide
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All listed product stock must be inputted in their base dimensions:
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 dark:border-slate-700">
              <span className="font-semibold text-slate-750 dark:text-slate-300">Weight Dimension</span>
              <span className="text-slate-500 dark:text-slate-400">g (Grams)</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 dark:border-slate-700">
              <span className="font-semibold text-slate-750 dark:text-slate-300">Volume Dimension</span>
              <span className="text-slate-500 dark:text-slate-400">mL (Milliliters)</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1.5">
              <span className="font-semibold text-slate-750 dark:text-slate-300">Count/Items</span>
              <span className="text-slate-500 dark:text-slate-400">items</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-snug">
              Buyers can select units dynamically (e.g., ordering in kg or L) and prices will convert automatically based on your rate.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
