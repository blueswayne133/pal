// AddCardModal.jsx
import { useState } from 'react'
import api from '../../../../utils/api'

export default function AddCardModal({ onClose, onCardAdded }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    card_holder_name: '',
    card_number: '',
    expiry_month: '',
    expiry_year: '',
    cvv: ''
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    const groups = cleaned.match(/.{1,4}/g)
    return groups ? groups.join(' ').slice(0, 19) : ''
  }

  const handleCardNumberChange = (value) => {
    handleChange('card_number', formatCardNumber(value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Remove spaces from card number
      const submitData = {
        ...formData,
        card_number: formData.card_number.replace(/\s/g, '')
      }

      const response = await api.post('/user/cards', submitData)
      
      if (response.data.success) {
        onCardAdded()
        onClose()
      }
    } catch (error) {
      console.error('Failed to add card:', error)
      alert(error.response?.data?.message || 'Failed to add card')
    } finally {
      setLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Link a Card</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              value={formData.card_holder_name}
              onChange={(e) => handleChange('card_holder_name', e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={formData.card_number}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.expiry_month}
                  onChange={(e) => handleChange('expiry_month', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.expiry_year}
                  onChange={(e) => handleChange('expiry_year', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Year</option>
                  {Array.from({ length: 10 }, (_, i) => currentYear + i).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => handleChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                maxLength={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding Card...' : 'Link Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}