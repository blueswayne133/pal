// CardsSection.jsx
import { MoreVertical } from 'lucide-react'

export default function CardsSection({ user, stats }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  return (
    <div className="space-y-6">
      
      {/* Cards Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-xl">Cards</h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Cards Grid - 2 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Link a Card */}
        <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-200 transition-colors">
          <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#9CA3AF" />
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">
                +
              </text>
            </svg>
          </div>
          <p className="font-medium text-gray-900">Link a card</p>
        </div>

        {/* PayPal Balance */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 border-2 border-blue-600 rounded-lg flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#003087">
                P
              </text>
            </svg>
          </div>
          <p className="text-gray-600 text-sm">PayPal balance</p>
          <p className="text-3xl font-bold text-gray-900 my-2">
            {formatCurrency(user?.account_balance)}
          </p>
          <p className="text-gray-600 text-sm">Available</p>
        </div>
      </div>

      {/* Full Width Balance Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg" />
        <div className="flex-1">
          <p className="text-sm text-gray-600">PayPal balance</p>
          <p className="text-lg font-medium text-gray-900">
            {formatCurrency(user?.account_balance)} Available
          </p>
        </div>
      </div>

      {/* Card Links */}
      <div className="flex gap-6">
        <a href="#add-currency" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          Add a currency
        </a>
        <a href="#currency-calculator" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          Currency Calculator
        </a>
      </div>

      {/* Shop Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex gap-4 mt-8">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-600 rounded-lg" />
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-2">Cards</h4>
          <p className="text-gray-600 text-sm mb-4">Shop and send payments more securely. Link your credit card now.</p>
          <a href="#link-card" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Link a card
          </a>
        </div>
      </div>
    </div>
  )
}