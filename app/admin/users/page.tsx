import prisma from '@/lib/prisma'
import { Users } from 'lucide-react'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { role: 'asc' },
    include: {
      _count: {
        select: {
          products: true,
          orders: true
        }
      }
    }
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p className="text-gray-500 mt-1">View all registered sellers and buyers on the platform.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Products Listed</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Orders Placed</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p>No users found.</p>
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        user.role === 'SELLER' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{user._count.products}</td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{user._count.orders}</td>
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
