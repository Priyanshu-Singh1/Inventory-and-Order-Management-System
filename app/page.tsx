import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (session.user?.role === 'ADMIN') {
    redirect('/admin')
  }

  if (session.user?.role === 'SELLER') {
    redirect('/seller')
  }

  if (session.user?.role === 'BUYER') {
    redirect('/buyer')
  }

  // Fallback
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Unknown role. Please contact support.</p>
    </div>
  )
}
