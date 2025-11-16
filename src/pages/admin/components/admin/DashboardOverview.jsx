"use client"

import { useState, useEffect } from "react"
import { Users, CreditCard, DollarSign, TrendingUp, Activity, Eye } from "lucide-react"
import api from "../../../../utils/api"


export default function DashboardOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.stats?.total_users || 0,
      icon: Users,
      color: "blue",
      description: "Registered users"
    },
    {
      title: "Active Users",
      value: stats?.stats?.active_users || 0,
      icon: Activity,
      color: "green",
      description: "Active accounts"
    },
    {
      title: "Total Transactions",
      value: stats?.stats?.total_transactions || 0,
      icon: CreditCard,
      color: "purple",
      description: "All transactions"
    },
    {
      title: "Total Volume",
      value: `$${(stats?.stats?.total_volume || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "orange",
      description: "Completed transactions"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back, {stats?.admin?.name}</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
        >
          <Eye size={16} className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          const colorClasses = {
            blue: 'bg-blue-500 text-blue-600',
            green: 'bg-green-500 text-green-600',
            purple: 'bg-purple-500 text-purple-600',
            orange: 'bg-orange-500 text-orange-600'
          }

          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[card.color].split(' ')[0]} bg-opacity-10`}>
                  <Icon size={24} className={colorClasses[card.color].split(' ')[1]} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <span className="text-sm text-gray-500">Last 10</span>
          </div>
          <div className="space-y-3">
            {stats?.stats?.recent_transactions?.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {transaction.sender?.name} → {transaction.receiver?.name}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.reference_id}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${transaction.amount}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    transaction.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : transaction.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.stats?.recent_transactions || stats.stats.recent_transactions.length === 0) && (
              <p className="text-center text-gray-500 py-4">No recent transactions</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <span className="text-sm text-gray-500">Last 5</span>
          </div>
          <div className="space-y-3">
            {stats?.stats?.recent_users?.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users size={14} className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">${user.account_balance}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    user.is_active 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.stats?.recent_users || stats.stats.recent_users.length === 0) && (
              <p className="text-center text-gray-500 py-4">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}