// Activity.jsx
"use client"

import { useState, useEffect } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Search, Download, Sliders, Calendar, User, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import api from "../../utils/api"
import TransactionReceiptModal from "./components/cards/TransactionReceiptModal"

export default function Activity() {
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [user, setUser] = useState(null)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showReceipt, setShowReceipt] = useState(false)

  useEffect(() => {
    fetchTransactions()
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile')
      if (response.data.success) {
        setUser(response.data.data.user)
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    }
  }

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await api.get('/transactions')
      
      if (response.data.success) {
        setTransactions(response.data.data.transactions.data || response.data.data.transactions)
      }
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.reference_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.sender?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.receiver?.name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    const matchesType = filterType === 'all' || transaction.type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  const getTransactionIcon = (transaction) => {
    if (transaction.type === 'payment' || transaction.type === 'send') {
      return <ArrowUpRight className="h-5 w-5 text-red-500" />
    } else if (transaction.type === 'request' || transaction.type === 'receive') {
      return <ArrowDownLeft className="h-5 w-5 text-green-500" />
    }
    return <User className="h-5 w-5 text-gray-500" />
  }

  const getTransactionColor = (transaction) => {
    if (transaction.type === 'payment' || transaction.type === 'send') {
      return "text-red-600"
    } else if (transaction.type === 'request' || transaction.type === 'receive') {
      return "text-green-600"
    }
    return "text-gray-600"
  }

  const getAmountPrefix = (transaction) => {
    if (transaction.type === 'payment' || transaction.type === 'send') {
      return "-"
    } else if (transaction.type === 'request' || transaction.type === 'receive') {
      return "+"
    }
    return ""
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

  const formatCurrency = (amount) => {
    const currencySymbol = user?.currency || '$'
    const amountFormatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0)
    
    return `${currencySymbol}${amountFormatted}`
  }

  const exportTransactions = () => {
    // Get currency name for export
    const getCurrencyName = (currencySymbol) => {
      const currencies = {
        '$': 'USD',
        '€': 'EUR',
        '£': 'GBP',
        '¥': 'JPY',
        'CA$': 'CAD',
        'A$': 'AUD',
        'CHF': 'CHF',
        'CN¥': 'CNY',
        '₹': 'INR',
        'S$': 'SGD',
        'HK$': 'HKD',
        'kr': 'SEK',
        'NZ$': 'NZD',
        'MX$': 'MXN',
        'R$': 'BRL',
        '₽': 'RUB',
        'R': 'ZAR'
      }
      return currencies[user?.currency || '$'] || 'USD'
    }

    const currencyCode = getCurrencyName(user?.currency || '$')
    
    const csvContent = [
      ['Date', 'Description', 'Type', 'Status', `Amount (${currencyCode})`, 'Fee', 'Net Amount', 'Reference ID'],
      ...filteredTransactions.map(t => [
        formatDate(t.created_at),
        t.description || 'N/A',
        t.type,
        t.status,
        t.amount,
        t.fee || 0,
        t.net_amount || t.amount,
        t.reference_id
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction)
    setShowReceipt(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">


      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600">View and manage your payment activities</p>
          {user?.currency && (
            <p className="text-sm text-gray-500 mt-1">
              Amounts displayed in: {user.currency}
            </p>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by reference, description, or contact name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-2 border-gray-200 py-3 pl-12 pr-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border-2 border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-lg border-2 border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="payment">Payment</option>
              <option value="request">Request</option>
              <option value="admin_credit">Credit</option>
              <option value="admin_debit">Debit</option>
            </select>
            
            <button 
              onClick={exportTransactions}
              className="flex items-center gap-2 rounded-lg border-2 border-gray-200 px-4 py-3 transition-colors hover:bg-gray-100"
            >
              <Download className="h-5 w-5 text-gray-600" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>

        {/* Transaction Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)}
                className="rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      {getTransactionIcon(transaction)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {transaction.description || `${transaction.type} ${transaction.sender?.id === transaction.user_id ? 'to' : 'from'} ${transaction.sender?.id === transaction.user_id ? transaction.receiver?.name : transaction.sender?.name}`}
                      </h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(transaction.created_at)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {transaction.type}
                        </span>
                      </div>
                      {transaction.reference_id && (
                        <p className="mt-1 text-xs text-gray-500">
                          Reference: {transaction.reference_id}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${getTransactionColor(transaction)}`}>
                      {getAmountPrefix(transaction)}{formatCurrency(transaction.amount)}
                    </p>
                    {transaction.fee > 0 && (
                      <p className="text-sm text-gray-500">
                        Fee: {formatCurrency(transaction.fee)}
                      </p>
                    )}
                    {transaction.net_amount && transaction.net_amount !== transaction.amount && (
                      <p className="text-sm text-gray-500">
                        Net: {formatCurrency(transaction.net_amount)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="mt-4 text-2xl font-bold text-gray-900">No transactions found</p>
              <p className="mt-2 text-gray-600">
                {searchQuery || filterStatus !== 'all' || filterType !== 'all' 
                  ? "Try adjusting your search or filters to see more results."
                  : "You haven't made any transactions yet. Send or request payments to get started."}
              </p>
              {(searchQuery || filterStatus !== 'all' || filterType !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setFilterStatus("all")
                    setFilterType("all")
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchTransactions}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Try again
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Receipt Modal */}
      {showReceipt && selectedTransaction && (
        <TransactionReceiptModal
          transaction={selectedTransaction}
          user={user}
          onClose={() => {
            setShowReceipt(false)
            setSelectedTransaction(null)
          }}
        />
      )}
    </div>
  )
}