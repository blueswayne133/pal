import { Search, DollarSign, User, MessageSquare } from 'lucide-react'
import { useState, useEffect } from "react"
import api from '../../../../utils/api'

export default function SendPayment() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [addToContacts, setAddToContacts] = useState(true)
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchUsers()
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile')
      if (response.data.success) {
        setUserInfo(response.data.data.user)
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    }
  }

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

  const handleSendPayment = async (e) => {
    e.preventDefault()
    if (!selectedUser || !amount) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await api.post('/payment/send', {
        receiver_email: selectedUser.email,
        amount: parseFloat(amount),
        description,
        add_to_contacts: addToContacts
      })

      if (response.data.success) {
        const currencySymbol = userInfo?.currency || '$'
        setSuccess(`Payment of ${currencySymbol}${amount} sent to ${selectedUser.name} successfully!`)
        setSelectedUser(null)
        setAmount("")
        setDescription("")
        setSearchTerm("")
      }
    } catch (err) {
      const errorData = err.response?.data
      setError(errorData?.message || 'Failed to send payment')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    const currencySymbol = userInfo?.currency || '$'
    const amountFormatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0)
    
    return `${currencySymbol}${amountFormatted}`
  }

  // Get currency symbol for input placeholder and fee calculation
  const getCurrencySymbol = () => {
    return userInfo?.currency || '$'
  }

  // Calculate fee based on amount
  const calculateFee = (amount) => {
    return (amount * 0.029) + 0.30
  }

  // Get fee description with correct currency symbol
  const getFeeDescription = () => {
    const currencySymbol = getCurrencySymbol()
    return `2.9% + ${currencySymbol}0.30`
  }

  return (
    <div className="px-6 md:px-12 py-12 max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Send payment to</h2>

      {/* Currency Display */}
      {userInfo?.currency && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            Amounts displayed in: <span className="font-semibold">{userInfo.currency}</span>
          </p>
        </div>
      )}

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

        {searchResults.length > 0 && !selectedUser && (
          <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedUser(user)
                  setSearchTerm("")
                  setSearchResults([])
                }}
              >
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                {user.phone && <div className="text-sm text-gray-600">{user.phone}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Selected User */}
        {selectedUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{selectedUser.name}</div>
                <div className="text-sm text-gray-600">{selectedUser.email}</div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Amount Input */}
        {selectedUser && (
          <>
            <div className="relative">
              <DollarSign className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <span className="absolute left-10 top-4 text-gray-500 text-lg font-medium">
                {getCurrencySymbol()}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-16 pr-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-2xl font-medium"
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

            {/* Add to Contacts */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="addToContacts"
                checked={addToContacts}
                onChange={(e) => setAddToContacts(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="addToContacts" className="text-sm text-gray-700">
                Add to contacts
              </label>
            </div>

            {/* Fee Calculation */}
            {amount && (
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="flex justify-between mb-1">
                  <span>Amount:</span>
                  <span>{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Fee ({getFeeDescription()}):</span>
                  <span>{formatCurrency(calculateFee(parseFloat(amount)))}</span>
                </div>
                <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
                  <span>Receiver gets:</span>
                  <span>{formatCurrency(parseFloat(amount) - calculateFee(parseFloat(amount)))}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleSendPayment}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed w-fit"
            >
              {loading ? "Sending..." : `Send ${formatCurrency(parseFloat(amount))}`}
            </button>
          </>
        )}
      </div>
    </div>
  )
}