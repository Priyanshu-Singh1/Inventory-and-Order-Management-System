import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ListOrdered, Home, LogOut, Users, Shield, Bell } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/login')
  }

  const userEmail = session.user.email || 'Admin User'

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-none">Admin Panel</h2>
            <span className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">Platform Owner</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors font-medium">
            <Home className="w-5 h-5 text-indigo-400" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors font-medium">
            <Package className="w-5 h-5 text-indigo-400" />
            All Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors font-medium">
            <ListOrdered className="w-5 h-5 text-indigo-400" />
            All Orders
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors font-medium">
            <Users className="w-5 h-5 text-indigo-400" />
            Users
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <a href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors font-medium">
            <LogOut className="w-5 h-5" />
            Sign Out
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent hidden md:block">
              Platform Overview
            </h1>
          </div>
          
          <div className="flex items-center gap-6 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-800" />
            </button>
            
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed In As</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{userEmail}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {userEmail.slice(0, 2).toUpperCase()}
              </div>
              
              <a href="/api/auth/signout" className="p-2 text-slate-400 hover:text-red-500 md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors">
                <LogOut className="w-5 h-5" />
              </a>
            </div>
          </div>
        </header>

        {/* Inner Content */}
        <main className="flex-1 overflow-auto bg-slate-55/40 dark:bg-slate-950/20">
          {children}
        </main>
      </div>
    </div>
  )
}
