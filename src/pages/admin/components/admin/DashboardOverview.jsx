// DashboardOverview.jsx
"use client"

import { useState, useEffect } from "react"
import { Users, CreditCard, DollarSign, TrendingUp, Activity, Eye, RefreshCw } from "lucide-react"
import api from "../../../../utils/api"

export default function DashboardOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setRefreshing(true)
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
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Error Loading Data</h3>
            <p className="mt-1">{error}</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.stats?.total_users || 0,
      icon: Users,
      color: "blue",
      description: "Registered users",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Active Users",
      value: stats?.stats?.active_users || 0,
      icon: Activity,
      color: "green",
      description: "Active accounts",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Total Transactions",
      value: stats?.stats?.total_transactions || 0,
      icon: CreditCard,
      color: "purple",
      description: "All transactions",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Total Volume",
      value: `$${(stats?.stats?.total_volume || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "orange",
      description: "Completed transactions",
      gradient: "from-orange-500 to-orange-600"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2 text-lg">Welcome back, <span className="font-semibold text-blue-600">{stats?.admin?.name}</span></p>
        </div>
        <button 
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md font-semibold flex items-center disabled:opacity-50"
        >
          {refreshing ? (
            <RefreshCw size={18} className="mr-2 animate-spin" />
          ) : (
            <Eye size={18} className="mr-2" />
          )}
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${card.gradient} shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                  <Icon size={28} className="text-white" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <TrendingUp size={14} className="mr-1 text-green-500" />
                  <span>Updated just now</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 10</span>
          </div>
          <div className="space-y-4">
            {stats?.stats?.recent_transactions?.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {transaction.sender?.name} → {transaction.receiver?.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate mt-1">{transaction.reference_id}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-gray-900 text-lg">${transaction.amount}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    transaction.status === 'completed' 
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : transaction.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.stats?.recent_transactions || stats.stats.recent_transactions.length === 0) && (
              <div className="text-center py-8">
                <CreditCard size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No recent transactions</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Users</h3>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 5</span>
          </div>
          <div className="space-y-4">
            {stats?.stats?.recent_users?.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <Users size={20} className="text-white" />
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate mt-1">{user.email}</p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-gray-900 text-lg">${user.account_balance}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    user.is_active 
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.stats?.recent_users || stats.stats.recent_users.length === 0) && (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No recent users</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}