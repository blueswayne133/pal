// BalanceCard.jsx
import { MoreVertical } from 'lucide-react'

export default function BalanceCard({ user, stats }) {
  const formatCurrency = (amount) => {
    const currencySymbol = user?.currency || '$'
    
    // Format the number with proper decimal places
    const amountFormatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0)
    
    // Return the currency symbol + formatted amount
    return `${currencySymbol}${amountFormatted}`
  }

  // Helper function to get currency name for display
  const getCurrencyName = () => {
    const currencies = {
      '$': 'US Dollar',
      '€': 'Euro',
      '£': 'British Pound',
      '¥': 'Japanese Yen',
      'CA$': 'Canadian Dollar',
      'A$': 'Australian Dollar',
      'CHF': 'Swiss Franc',
      'CN¥': 'Chinese Yuan',
      '₹': 'Indian Rupee',
      'S$': 'Singapore Dollar',
      'HK$': 'Hong Kong Dollar',
      'kr': 'Swedish Krona',
      'NZ$': 'New Zealand Dollar',
      'MX$': 'Mexican Peso',
      'R$': 'Brazilian Real',
      '₽': 'Russian Ruble',
      'R': 'South African Rand'
    }
    return currencies[user?.currency || '$'] || 'US Dollar'
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
      <div className="flex justify-between items-center">
        <p className="text-gray-600 text-sm">Available</p>
        <p className="text-xs text-gray-500">
          {getCurrencyName()}
        </p>
      </div>
    </div>
  )
}