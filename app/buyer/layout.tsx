import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Store, ShoppingCart, LogOut, Package } from 'lucide-react'
import BuyerHeader from '@/components/BuyerHeader'

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'BUYER') {
    redirect('/login')
  }

  const userEmail = session.user.email || 'Buyer User'

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 border-r border-slate-900 hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-900 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg text-white">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-none">Buyer Portal</h2>
            <span className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">Marketplace</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <Link href="/buyer" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-900 hover:text-white rounded-lg transition-colors font-medium">
            <Store className="w-5 h-5 text-indigo-400" />
            Catalog
          </Link>
          <Link href="/buyer/cart" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-900 hover:text-white rounded-lg transition-colors font-medium">
            <ShoppingCart className="w-5 h-5 text-indigo-400" />
            My Cart
          </Link>
          <Link href="/buyer/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-900 hover:text-white rounded-lg transition-colors font-medium">
            <Package className="w-5 h-5 text-indigo-400" />
            My Orders
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-900">
          <a href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-900 hover:text-red-300 rounded-lg transition-colors font-medium">
            <LogOut className="w-5 h-5" />
            Sign Out
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <BuyerHeader userEmail={userEmail} />

        {/* Inner Content */}
        <main className="flex-1 overflow-auto bg-slate-55/40 dark:bg-slate-950/20">
          {children}
        </main>
      </div>
    </div>
  )
}
