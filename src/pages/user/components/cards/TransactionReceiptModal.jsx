// TransactionReceiptModal.jsx
import { useState } from 'react'
import { Download, Printer, X, ArrowUpRight, ArrowDownLeft, User, Building, CreditCard } from 'lucide-react'

export default function TransactionReceiptModal({ transaction, user, onClose }) {
  const [loading, setLoading] = useState(false)

  const getTransactionIcon = () => {
    if (transaction.type === 'payment' || transaction.type === 'send') {
      return <ArrowUpRight className="h-6 w-6 text-red-500" />
    } else if (transaction.type === 'request' || transaction.type === 'receive') {
      return <ArrowDownLeft className="h-6 w-6 text-green-500" />
    }
    return <User className="h-6 w-6 text-gray-500" />
  }

  const getTransactionTypeLabel = () => {
    const types = {
      'payment': 'Payment Sent',
      'send': 'Money Sent',
      'request': 'Money Request',
      'receive': 'Money Received',
      'admin_credit': 'Admin Credit',
      'admin_debit': 'Admin Debit'
    }
    return types[transaction.type] || transaction.type
  }

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getAmountPrefix = () => {
    if (transaction.type === 'payment' || transaction.type === 'send') {
      return "-"
    } else if (transaction.type === 'request' || transaction.type === 'receive') {
      return "+"
    }
    return ""
  }

  const getAmountColor = () => {
    if (transaction.type === 'payment' || transaction.type === 'send') {
      return "text-red-600"
    } else if (transaction.type === 'request' || transaction.type === 'receive') {
      return "text-green-600"
    }
    return "text-gray-600"
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    setLoading(true)
    
    // Create receipt content
    const receiptContent = `
PAYPAL TRANSACTION RECEIPT
===============================

Transaction Details:
-------------------
Reference ID: ${transaction.reference_id}
Date & Time: ${formatDate(transaction.created_at)}
Status: ${transaction.status.toUpperCase()}
Type: ${getTransactionTypeLabel()}

Amount: ${getAmountPrefix()}${formatCurrency(transaction.amount)}
${transaction.fee > 0 ? `Fee: ${formatCurrency(transaction.fee)}` : ''}
${transaction.net_amount && transaction.net_amount !== transaction.amount ? 
  `Net Amount: ${formatCurrency(transaction.net_amount)}` : ''}

Parties:
--------
${transaction.sender ? `From: ${transaction.sender.name} (${transaction.sender.email})` : 'N/A'}
${transaction.receiver ? `To: ${transaction.receiver.name} (${transaction.receiver.email})` : 'N/A'}

Description:
-----------
${transaction.description || 'No description provided'}

Additional Information:
----------------------
Transaction ID: ${transaction.id}
${transaction.note ? `Note: ${transaction.note}` : ''}

---
Thank you for using PayPal
This is an automated receipt. Please keep it for your records.
    `.trim()

    // Create and trigger download
    const element = document.createElement('a')
    const file = new Blob([receiptContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `paypal-receipt-${transaction.reference_id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 print:bg-white print:bg-opacity-100">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 print:border-b-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center print:bg-black">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Transaction Receipt</h2>
              <p className="text-sm text-gray-600">Official PayPal Receipt</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {loading ? 'Downloading...' : 'Download'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200">
                  {getTransactionIcon()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{getTransactionTypeLabel()}</h3>
                  <p className="text-sm text-gray-600">Reference: {transaction.reference_id}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                {transaction.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Amount Section */}
          <div className="text-center border-b border-gray-200 pb-6">
            <p className="text-sm text-gray-600 mb-2">TOTAL AMOUNT</p>
            <h3 className={`text-4xl font-bold ${getAmountColor()}`}>
              {getAmountPrefix()}{formatCurrency(transaction.amount)}
            </h3>
            {transaction.fee > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Fee: {formatCurrency(transaction.fee)}
              </p>
            )}
            {transaction.net_amount && transaction.net_amount !== transaction.amount && (
              <p className="text-sm text-gray-600">
                Net Amount: {formatCurrency(transaction.net_amount)}
              </p>
            )}
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Transaction Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium text-gray-900">{formatDate(transaction.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-medium text-gray-900 font-mono text-sm">{transaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reference ID</p>
                  <p className="font-medium text-gray-900 font-mono text-sm">{transaction.reference_id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Parties Involved</h4>
              <div className="space-y-3">
                {transaction.sender && (
                  <div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="font-medium text-gray-900">{transaction.sender.name}</p>
                    {transaction.sender.email && (
                      <p className="text-sm text-gray-600">{transaction.sender.email}</p>
                    )}
                  </div>
                )}
                {transaction.receiver && (
                  <div>
                    <p className="text-sm text-gray-600">To</p>
                    <p className="font-medium text-gray-900">{transaction.receiver.name}</p>
                    {transaction.receiver.email && (
                      <p className="text-sm text-gray-600">{transaction.receiver.email}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {transaction.description && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
              <p className="text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-200">
                {transaction.description}
              </p>
            </div>
          )}

          {/* Note */}
          {transaction.note && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Note</h4>
              <p className="text-gray-700 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                {transaction.note}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <Building className="h-5 w-5" />
              <span className="font-semibold">PAYPAL SECURE TRANSACTION</span>
            </div>
            <p className="text-xs text-gray-500">
              This is an automated receipt. Please keep it for your records.<br />
              If you have any questions, please visit PayPal Help Center.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Receipt generated on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}