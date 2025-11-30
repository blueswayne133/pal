import { ArrowLeft } from 'lucide-react'

export default function ReceiptConfirmation({ 
  transaction, 
  onConfirm, 
  onBack,
  loading = false
}) {
  const {
    amount = 0,
    currency = '$',
    recipient = {},
    description = '*Deposit*',
    method = 'PayPal Balance',
    fee = 0,
    total = 0
  } = transaction

  const formatAmount = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const getCurrencySymbol = (curr) => {
    const symbols = {
      '$': '$',
      '€': '€',
      '£': '£'
    }
    return symbols[curr] || curr
  }

  const currencySymbol = getCurrencySymbol(currency)
  const formattedAmount = formatAmount(amount)
  const formattedFee = formatAmount(fee)
  const formattedTotal = formatAmount(total)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={loading}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Review and send</h1>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Amount Display */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {currencySymbol}{formattedAmount}
          </div>
          <div className="text-gray-600">to {recipient.email}</div>
        </div>

        {/* Recipient Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 mb-1">To</div>
          <div className="font-medium text-gray-900">{recipient.name}</div>
          <div className="text-sm text-gray-600">{recipient.email}</div>
        </div>

        {/* Payment Details */}
        <div className="border border-gray-200 rounded-lg mb-6">
          {/* Header */}
          <div className="border-b border-gray-200 px-4 py-3">
            <div className="text-sm font-medium text-gray-900">{description}</div>
          </div>

          {/* Details */}
          <div className="divide-y divide-gray-200">
            <div className="px-4 py-3 flex justify-between items-center">
              <div className="text-sm text-gray-600">Method</div>
              <div className="text-sm font-medium text-gray-900">{method}</div>
            </div>
            <div className="px-4 py-3 flex justify-between items-center">
              <div className="text-sm text-gray-600">Amount</div>
              <div className="text-sm font-medium text-gray-900">{currencySymbol}{formattedAmount}</div>
            </div>
            <div className="px-4 py-3 flex justify-between items-center">
              <div className="text-sm text-gray-600">Fee</div>
              <div className="text-sm font-medium text-gray-900">${formattedFee}</div>
            </div>
            <div className="px-4 py-3 flex justify-between items-center bg-gray-50">
              <div className="text-sm font-medium text-gray-900">Total</div>
              <div className="text-sm font-medium text-gray-900">{currencySymbol}{formattedTotal}</div>
            </div>
          </div>
        </div>

        {/* Warning Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Note:</p>
            <p>This payment will be sent instantly and cannot be cancelled. Make sure all details are correct.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Processing..." : `Send ${currencySymbol}${formattedAmount} now`}
          </button>
          
          <button
            onClick={onBack}
            disabled={loading}
            className="w-full border border-gray-300 text-gray-700 font-medium py-4 px-6 rounded-full hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}