// BalanceCard.jsx
import { MoreVertical } from 'lucide-react'

export default function BalanceCard({ user, stats }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 text-lg">PayPal balance</h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
      <div className="mb-2">
        <p className="text-5xl font-bold text-gray-900">
          {formatCurrency(user?.account_balance)}
        </p>
      </div>
      <p className="text-gray-600 text-sm">Available</p>
    </div>
  )
}