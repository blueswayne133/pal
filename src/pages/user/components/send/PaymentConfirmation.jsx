import { CheckCircle, Copy, Share2, ArrowLeft, Mail } from 'lucide-react'
import { useState } from 'react'

export default function PaymentConfirmation({ 
  transaction, 
  onBack 
}) {
  const {
    amount = 5000,
    currency = '$',
    recipient = {},
    shareLink = 'https://sorts.one/g6x/transaction/3'
  } = transaction

  const [copied, setCopied] = useState(false)

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Send
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          You've sent {currencySymbol}{formattedAmount} to
        </h1>

        {/* Recipient Info */}
        <div className="text-center mb-8">
          <div className="text-gray-900 font-medium text-lg">{recipient.name}</div>
          <div className="text-gray-600">{recipient.email}</div>
        </div>

        {/* Email Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">We'll send them an email</p>
              <p>but it may be helpful to share the payment link directly.</p>
            </div>
          </div>
        </div>

        {/* Transaction Link */}
        <div className="border border-gray-300 rounded-lg p-4 mb-8">
          <div className="text-sm text-gray-600 mb-2">Transaction Link</div>
          <div className="flex items-center justify-between">
            <div className="font-mono text-gray-900 text-sm truncate">
              {shareLink}
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleCopyLink}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <Copy className="w-5 h-5" />
            Copy Link & Share
          </button>
          
          <button
            onClick={() => window.open(shareLink, '_blank')}
            className="w-full border border-gray-300 text-gray-700 font-medium py-4 px-6 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Open Transaction
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <p className="mb-2">What happens next?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Recipient will receive an email notification</li>
              <li>They can claim the payment using the link above</li>
              <li>Payment will be available in their account within 1-2 business days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}