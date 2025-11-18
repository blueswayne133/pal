"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Filter, Eye, Edit, Trash2, CreditCard, Mail, UserX, UserCheck, Download } from "lucide-react"
import api from "../../../../utils/api"

export default function UserManagement({ onUserSelect }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [showDebitModal, setShowDebitModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm, statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await api.get(`/admin/users?${params}`)
      if (response.data.success) {
        setUsers(response.data.data.data)
        setTotalPages(response.data.data.last_page)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleCreditUser = async (userId, amount, description) => {
    try {
      const response = await api.post(`/admin/users/${userId}/credit`, {
        amount: parseFloat(amount),
        description
      })
      
      if (response.data.success) {
        alert('Account credited successfully!')
        setShowCreditModal(false)
        setSelectedUser(null)
        fetchUsers() // Refresh data
      }
    } catch (error) {
      console.error('Failed to credit account:', error)
      alert('Failed to credit account')
    }
  }

  const handleDebitUser = async (userId, amount, description) => {
    try {
      const response = await api.post(`/admin/users/${userId}/debit`, {
        amount: parseFloat(amount),
        description
      })
      
      if (response.data.success) {
        alert('Account debited successfully!')
        setShowDebitModal(false)
        setSelectedUser(null)
        fetchUsers() // Refresh data
      }
    } catch (error) {
      console.error('Failed to debit account:', error)
      alert('Failed to debit account')
    }
  }

  const handleToggleStatus = async (userId, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
      return
    }

    try {
      const response = await api.post(`/admin/users/${userId}/toggle-status`)
      if (response.data.success) {
        alert(`User ${currentStatus ? 'deactivated' : 'activated'} successfully!`)
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error)
      alert('Failed to update user status')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const response = await api.delete(`/admin/users/${userId}`)
      if (response.data.success) {
        alert('User deleted successfully!')
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user')
    }
  }

  const handleExportUsers = async () => {
    try {
      const response = await api.get('/admin/users/export/csv', {
        responseType: 'blob'
      })
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export users:', error)
      alert('Failed to export users')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all system users</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportUsers}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
          >
            <Download size={16} className="mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusFilter('')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === '' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter('active')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'active' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => handleStatusFilter('inactive')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'inactive' 
                  ? 'bg-red-100 text-red-700 border border-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
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
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${user.account_balance}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => onUserSelect(user)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowCreditModal(true)
                            }}
                            className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                            title="Credit Account"
                          >
                            <CreditCard size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowDebitModal(true)
                            }}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded transition-colors"
                            title="Debit Account"
                          >
                            <CreditCard size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id, user.is_active)}
                            className={`p-1 rounded transition-colors ${
                              user.is_active 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={user.is_active ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No users found</p>
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

      {/* Credit Account Modal */}
      {showCreditModal && selectedUser && (
        <CreditModal
          user={selectedUser}
          onClose={() => {
            setShowCreditModal(false)
            setSelectedUser(null)
          }}
          onCredit={handleCreditUser}
        />
      )}

      {/* Debit Account Modal */}
      {showDebitModal && selectedUser && (
        <DebitModal
          user={selectedUser}
          onClose={() => {
            setShowDebitModal(false)
            setSelectedUser(null)
          }}
          onDebit={handleDebitUser}
        />
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchUsers()
          }}
        />
      )}
    </div>
  )
}

// Credit Modal Component
function CreditModal({ user, onClose, onCredit }) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setLoading(true)
    await onCredit(user.id, amount, description)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Credit User Account</h3>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Crediting account for: <strong>{user.name}</strong> ({user.email})
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Current Balance: <strong>${user.account_balance}</strong>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Reason for credit"
              />
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
              {loading ? 'Processing...' : 'Credit Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Debit Modal Component
function DebitModal({ user, onClose, onDebit }) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (parseFloat(amount) > user.account_balance) {
      alert('Debit amount cannot exceed user balance')
      return
    }

    setLoading(true)
    await onDebit(user.id, amount, description)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Debit User Account</h3>
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700">
            Debiting account for: <strong>{user.name}</strong> ({user.email})
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            Current Balance: <strong>${user.account_balance}</strong>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (Max: ${user.account_balance})
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={user.account_balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Required)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Reason for debit"
                required
              />
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
              className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Processing...' : 'Debit Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Create User Modal Component
function CreateUserModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    account_balance: "0.00",
    currency: "USD"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.post('/admin/users', {
        ...formData,
        account_balance: parseFloat(formData.account_balance)
      })

      if (response.data.success) {
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to create user:', error)
      setError(error.response?.data?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Create New User</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Balance
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="account_balance"
                value={formData.account_balance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}