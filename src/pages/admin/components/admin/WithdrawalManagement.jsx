"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Edit, Trash2, DollarSign, Download, RefreshCw } from "lucide-react"
import api from "../../../../utils/api"

export default function WithdrawalManagement() {
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [methodFilter, setMethodFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showClearanceFeeModal, setShowClearanceFeeModal] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchWithdrawals()
    fetchWithdrawalStats()
  }, [currentPage, searchTerm, statusFilter, methodFilter])

  const fetchWithdrawals = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(methodFilter && { method: methodFilter })
      })

      const response = await api.get(`/admin/withdrawals?${params}`)
      if (response.data.success) {
        setWithdrawals(response.data.data.data)
        setTotalPages(response.data.data.last_page)
      }
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWithdrawalStats = async () => {
    try {
      const response = await api.get('/admin/withdrawals-stats')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch withdrawal stats:', error)
    }
  }

  const handleStatusUpdate = async (withdrawalId, newStatus) => {
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return
    }

    try {
      const response = await api.put(`/admin/withdrawals/${withdrawalId}`, {
        status: newStatus
      })

      if (response.data.success) {
        alert('Withdrawal status updated successfully!')
        fetchWithdrawals()
        fetchWithdrawalStats()
      }
    } catch (error) {
      console.error('Failed to update withdrawal status:', error)
      alert('Failed to update withdrawal status')
    }
  }

  const handleClearanceFeeUpdate = async (withdrawalId, clearanceFee) => {
    try {
      const response = await api.put(`/admin/withdrawals/${withdrawalId}/clearance-fee`, {
        clearance_fee: clearanceFee
      })

      if (response.data.success) {
        alert('Clearance fee updated successfully!')
        setShowClearanceFeeModal(false)
        fetchWithdrawals()
      }
    } catch (error) {
      console.error('Failed to update clearance fee:', error)
      alert('Failed to update clearance fee')
    }
  }

  const handleDeleteWithdrawal = async (withdrawalId) => {
    if (!confirm('Are you sure you want to delete this withdrawal? This action cannot be undone.')) {
      return
    }

    try {
      const response = await api.delete(`/admin/withdrawals/${withdrawalId}`)
      if (response.data.success) {
        alert('Withdrawal deleted successfully!')
        fetchWithdrawals()
        fetchWithdrawalStats()
      }
    } catch (error) {
      console.error('Failed to delete withdrawal:', error)
      alert('Failed to delete withdrawal')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Withdrawal Management</h1>
          <p className="text-gray-600 mt-1">Manage all withdrawal requests</p>
        </div>
        <button 
          onClick={fetchWithdrawals}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_withdrawals}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-4">
            <p className="text-sm font-medium text-yellow-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.pending_withdrawals}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
            <p className="text-sm font-medium text-blue-600">Processing</p>
            <p className="text-2xl font-bold text-blue-700">{stats.processing_withdrawals}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
            <p className="text-sm font-medium text-green-600">Completed</p>
            <p className="text-2xl font-bold text-green-700">{stats.completed_withdrawals}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
            <p className="text-sm font-medium text-red-600">Failed</p>
            <p className="text-2xl font-bold text-red-700">{stats.failed_withdrawals}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600">Total Amount</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.total_withdrawal_amount)}</p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by reference, name, bank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Methods</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="wire_transfer">Wire Transfer</option>
            <option value="paypal">PayPal</option>
            <option value="crypto">Crypto</option>
          </select>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount & Fees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">{withdrawal.reference_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{withdrawal.user?.name}</div>
                        <div className="text-sm text-gray-500">{withdrawal.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(withdrawal.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Fee: {formatCurrency(withdrawal.fee)} | Clearance: {formatCurrency(withdrawal.clearance_fee || 0)}
                        </div>
                        <div className="text-xs font-medium text-green-600">
                          Net: {formatCurrency(withdrawal.net_amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {withdrawal.method.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {withdrawal.bank_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(withdrawal.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal)
                              setShowDetailModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal)
                              setShowClearanceFeeModal(true)
                            }}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded transition-colors"
                            title="Set Clearance Fee"
                          >
                            <DollarSign size={16} />
                          </button>
                          {withdrawal.status === 'pending' && (
                            <button
                              onClick={() => handleDeleteWithdrawal(withdrawal.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                              title="Delete Withdrawal"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {withdrawals.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No withdrawals found</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Clearance Fee Modal */}
      {showClearanceFeeModal && selectedWithdrawal && (
        <ClearanceFeeModal
          withdrawal={selectedWithdrawal}
          onClose={() => {
            setShowClearanceFeeModal(false)
            setSelectedWithdrawal(null)
          }}
          onUpdate={handleClearanceFeeUpdate}
        />
      )}
    </div>
  )
}

// Clearance Fee Modal Component
function ClearanceFeeModal({ withdrawal, onClose, onUpdate }) {
  const [clearanceFee, setClearanceFee] = useState(withdrawal.clearance_fee || "0.00")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onUpdate(withdrawal.id, parseFloat(clearanceFee))
    setLoading(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Set Clearance Fee</h3>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            Withdrawal: <strong>{withdrawal.reference_id}</strong>
          </p>
          <p className="text-sm text-gray-700">
            Amount: <strong>{formatCurrency(withdrawal.amount)}</strong>
          </p>
          <p className="text-sm text-gray-700">
            Current Fee: <strong>{formatCurrency(withdrawal.fee)}</strong>
          </p>
          <p className="text-sm text-gray-700">
            Current Net Amount: <strong>{formatCurrency(withdrawal.net_amount)}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clearance Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={clearanceFee}
                onChange={(e) => setClearanceFee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                New net amount will be: {formatCurrency(withdrawal.amount - withdrawal.fee - parseFloat(clearanceFee))}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Updating...' : 'Update Fee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}