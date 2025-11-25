// RecentActivityCard.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, ArrowDownLeft, User } from 'lucide-react'
import api from '../../../../utils/api'
import TransactionReceiptModal from './TransactionReceiptModal'

export default function RecentActivityCard({ user }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRecentTransactions()
  }, [])

  const fetchRecentTransactions = async () => {
    try {
      setLoading(true)
      const response = await api.get('/transactions?limit=5')
      
      if (response.data.success) {
        const transactionsData = response.data.data.transactions.data || response.data.data.transactions
        setTransactions(Array.isArray(transactionsData) ? transactionsData.slice(0, 5) : [])
      }
    } catch (err) {
      console.error('Error fetching recent transactions:', err)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (transaction) => {
    if (transaction.type === 'payment' || transaction.type === 'send') {
      return <ArrowUpRight className="h-4 w-4 text-red-500" />
    } else if (transaction.type === 'request' || transaction.type === 'receive') {
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />
    }
    return <User className="h-4 w-4 text-gray-500" />
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

  const formatCurrency = (amount) => {
    const currencySymbol = user?.currency || '$'
    const amountFormatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0)
    
    return `${currencySymbol}${amountFormatted}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getTransactionDescription = (transaction) => {
    if (transaction.description) {
      return transaction.description
    }
    
    if (transaction.sender && transaction.receiver) {
      const isOutgoing = transaction.sender.id === user?.id
      const contactName = isOutgoing ? transaction.receiver.name : transaction.sender.name
      return `${transaction.type} ${isOutgoing ? 'to' : 'from'} ${contactName}`
    }
    
    return `${transaction.type} transaction`
  }

  const handleViewAll = () => {
    navigate('/activity')
  }

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction)
    setShowReceipt(true)
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 text-xl mb-4">Recent activity</h3>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-xl">Recent activity</h3>
          {transactions.length > 0 && (
            <button 
              onClick={handleViewAll}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Show all
            </button>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              See when money comes in, and when it goes out. You'll find your recent PayPal activity here.
            </p>
            <button 
              onClick={handleViewAll}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View Activity
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    {getTransactionIcon(transaction)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {getTransactionDescription(transaction)}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.created_at)}
                      {transaction.status !== 'completed' && (
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                          transaction.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${getTransactionColor(transaction)}`}>
                    {getAmountPrefix(transaction)}{formatCurrency(transaction.amount)}
                </p>
                  {transaction.fee > 0 && (
                    <p className="text-xs text-gray-500">
                      Fee: {formatCurrency(transaction.fee)}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {transactions.length < 5 && (
              <div className="pt-2">
                <p className="text-gray-600 text-sm text-center">
                  {transactions.length === 1 ? '1 transaction' : `${transactions.length} transactions`} found
                </p>
              </div>
            )}
          </div>
        )}
      </div>

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
    </>
  )
}