"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { KeyRound, Mail, Lock, Sparkles, User, Shield, Store, ShoppingBag } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    setLoading(false)

    if (result?.error) {
      toast.error('Invalid credentials. Please try again.')
    } else {
      toast.success('Logged in successfully!')
      router.push('/')
      router.refresh()
    }
  }

  const handleQuickFill = (emailValue: string, passwordValue: string) => {
    setEmail(emailValue)
    setPassword(passwordValue)
    toast.success(`Populated credentials for ${emailValue.split('@')[0]}`)
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 px-4 overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Main Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl shadow-lg shadow-indigo-500/25 mb-2">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
              Access Portal
            </h2>
            <p className="text-slate-400 text-sm">
              Inventory & Order Management System
            </p>
          </div>

          {/* Quick-Fill Helpers */}
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Quick Test Logins</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@example.com', 'admin123')}
                className="flex items-center justify-between px-3 py-2 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-red-400" />
                  <span>Admin</span>
                </div>
                <span className="text-slate-500">admin@example.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('seller@example.com', 'seller123')}
                className="flex items-center justify-between px-3 py-2 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2">
                  <Store className="w-3.5 h-3.5 text-purple-400" />
                  <span>Seller</span>
                </div>
                <span className="text-slate-500">seller@example.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('buyer@example.com', 'buyer123')}
                className="flex items-center justify-between px-3 py-2 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                  <span>Buyer</span>
                </div>
                <span className="text-slate-500">buyer@example.com</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-sm font-semibold rounded-lg text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
