import { Search, Users, DollarSign, MessageSquare } from 'lucide-react'
import { useState, useEffect } from "react"
import api from '../../../../utils/api'

export default function RequestPayment() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchUsers()
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  const searchUsers = async () => {
    setSearchLoading(true)
    try {
      const response = await api.get(`/payment/search-users?search=${searchTerm}`)
      if (response.data.success) {
        setSearchResults(response.data.data.users)
      }
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setSearchLoading(false)
    }
  }

  const addUser = (user) => {
    if (!selectedUsers.find(u => u.id === user.id) && selectedUsers.length < 20) {
      setSelectedUsers([...selectedUsers, user])
      setSearchTerm("")
      setSearchResults([])
    }
  }

  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId))
  }

  const handleRequestPayment = async (e) => {
    e.preventDefault()
    if (selectedUsers.length === 0 || !amount) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await api.post('/payment/request', {
        receiver_emails: selectedUsers.map(user => user.email),
        amount: parseFloat(amount),
        description
      })

      if (response.data.success) {
        setSuccess(`Payment requests of $${amount} sent to ${selectedUsers.length} people successfully!`)
        setSelectedUsers([])
        setAmount("")
        setDescription("")
      }
    } catch (err) {
      const errorData = err.response?.data
      setError(errorData?.message || 'Failed to send payment requests')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="px-6 md:px-12 py-12 max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Request payment from</h2>
      <p className="text-gray-600 mb-8">You can request multiple payments from up to 20 people.</p>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Name, username, email, mobile"
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-base"
          />
        </div>

        {/* Search Results */}
        {searchLoading && (
          <div className="text-gray-600 text-center">Searching...</div>
        )}

        {searchResults.length > 0 && (
          <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                onClick={() => addUser(user)}
              >
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white border border-blue-300 rounded-full px-3 py-1 text-sm flex items-center gap-2"
                >
                  <span>{user.name}</span>
                  <button
                    onClick={() => removeUser(user.id)}
                    className="text-gray-500 hover:text-gray-700 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="text-sm text-blue-700">
              {selectedUsers.length} people selected
            </div>
          </div>
        )}

        {/* Amount Input */}
        {selectedUsers.length > 0 && (
          <>
            <div className="relative">
              <DollarSign className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-2xl font-medium"
              />
            </div>

            {/* Description */}
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this for? (optional)"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-base"
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handleRequestPayment}
                disabled={loading || !amount || parseFloat(amount) <= 0}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : `Request ${formatCurrency(parseFloat(amount))}`}
              </button>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <Users className="w-5 h-5" />
                <span>{selectedUsers.length}/20</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}