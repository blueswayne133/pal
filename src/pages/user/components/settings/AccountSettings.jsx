import { Edit2, Plus, Save, X } from "lucide-react"
import { useState } from "react"

export default function AccountSettings({ user, onUpdateProfile }) {
  const [editingField, setEditingField] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [currencyLoading, setCurrencyLoading] = useState(false)

  const handleEdit = (field, value = '') => {
    setEditingField(field)
    setFormData(prev => ({ ...prev, [field]: value || user[field] || '' }))
  }

  const handleCancel = () => {
    setEditingField(null)
    setFormData({})
  }

  const handleSave = async () => {
    if (!formData[editingField]?.trim()) return

    setLoading(true)
    const result = await onUpdateProfile({ [editingField]: formData[editingField] })
    
    if (result.success) {
      setEditingField(null)
      setFormData({})
    }
    setLoading(false)
  }

  // NEW: Handle currency change with auto-save
  const handleCurrencyChange = async (newCurrency) => {
    setCurrencyLoading(true)
    try {
      const result = await onUpdateProfile({ currency: newCurrency })
      if (!result.success) {
        alert('Failed to update currency. Please try again.')
      }
    } catch (error) {
      console.error('Error updating currency:', error)
      alert('Error updating currency. Please try again.')
    } finally {
      setCurrencyLoading(false)
    }
  }

  // NEW: Handle language change with auto-save
  const handleLanguageChange = async (newLanguage) => {
    const result = await onUpdateProfile({ language: newLanguage })
    if (!result.success) {
      alert('Failed to update language. Please try again.')
    }
  }

  // NEW: Handle timezone change with auto-save
  const handleTimezoneChange = async (newTimezone) => {
    const result = await onUpdateProfile({ timezone: newTimezone })
    if (!result.success) {
      alert('Failed to update timezone. Please try again.')
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatPhone = (phone) => {
    if (!phone) return 'Not set'
    return phone.replace(/(\d{4})$/, '****')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    return `Joined in ${date.getFullYear()}`
  }

  const currencies = [
    { symbol: '$', name: 'US Dollar', code: 'USD' },
    { symbol: '€', name: 'Euro', code: 'EUR' },
    { symbol: '£', name: 'British Pound', code: 'GBP' },
    { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
    { symbol: 'CA$', name: 'Canadian Dollar', code: 'CAD' },
    { symbol: 'A$', name: 'Australian Dollar', code: 'AUD' },
    { symbol: 'CHF', name: 'Swiss Franc', code: 'CHF' },
    { symbol: 'CN¥', name: 'Chinese Yuan', code: 'CNY' },
    { symbol: '₹', name: 'Indian Rupee', code: 'INR' },
    { symbol: 'S$', name: 'Singapore Dollar', code: 'SGD' },
    { symbol: 'HK$', name: 'Hong Kong Dollar', code: 'HKD' },
    { symbol: 'kr', name: 'Swedish Krona', code: 'SEK' },
    { symbol: 'NZ$', name: 'New Zealand Dollar', code: 'NZD' },
    { symbol: 'MX$', name: 'Mexican Peso', code: 'MXN' },
    { symbol: 'R$', name: 'Brazilian Real', code: 'BRL' },
    { symbol: '₽', name: 'Russian Ruble', code: 'RUB' },
    { symbol: 'R', name: 'South African Rand', code: 'ZAR' }
  ]

  const getCurrencyName = (currencySymbol) => {
    const currency = currencies.find(c => c.symbol === currencySymbol)
    return currency ? currency.name : 'US Dollar'
  }

  const getCurrencyCode = (currencySymbol) => {
    const currency = currencies.find(c => c.symbol === currencySymbol)
    return currency ? currency.code : 'USD'
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg p-6 text-white mb-4 relative">
            <div className="flex justify-between items-start">
              <p className="text-sm">Profile</p>
              <p className="text-sm">{formatDate(user.created_at)}</p>
            </div>
            <div className="flex justify-center mt-8">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center relative">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <button className="absolute bottom-0 right-0 bg-white text-blue-600 p-1.5 rounded-full shadow-lg hover:bg-gray-100">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">{user.name || 'User'}</h3>
          
          {editingField === 'name' ? (
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
              <button
                onClick={handleSave}
                disabled={loading}
                className="p-2 text-green-600 hover:text-green-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleEdit('name', user.name)}
              className="text-blue-600 hover:text-blue-700 font-medium mb-4"
            >
              Change Name
            </button>
          )}

          {/* Account Options */}
          <div className="mt-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Account options</h4>
            <div className="space-y-4">
              <select 
                value={user.language || 'en'}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">Language - English</option>
                <option value="es">Language - Español</option>
                <option value="fr">Language - Français</option>
                <option value="de">Language - Deutsch</option>
                <option value="ja">Language - 日本語</option>
                <option value="zh">Language - 中文</option>
              </select>
              
              <select 
                value={user.timezone || 'UTC'}
                onChange={(e) => handleTimezoneChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="America/Los_Angeles">Time zone - (GMT-08:00) Pacific Time (Los Angeles)</option>
                <option value="America/New_York">Time zone - (GMT-05:00) Eastern Time</option>
                <option value="Europe/London">Time zone - (GMT+00:00) London</option>
                <option value="Europe/Paris">Time zone - (GMT+01:00) Paris</option>
                <option value="Asia/Tokyo">Time zone - (GMT+09:00) Tokyo</option>
                <option value="Asia/Singapore">Time zone - (GMT+08:00) Singapore</option>
                <option value="UTC">Time zone - UTC</option>
              </select>

              <div className="relative">
                <select 
                  value={user.currency || '$'}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  disabled={currencyLoading}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currencies.map(currency => (
                    <option key={currency.symbol} value={currency.symbol}>
                      Currency - {currency.symbol} ({currency.code}) - {currency.name}
                    </option>
                  ))}
                </select>
                {currencyLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current Currency Display */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Current Currency</h4>
            <p className="text-blue-700">
              {user.currency || '$'} - {getCurrencyName(user.currency || '$')} ({getCurrencyCode(user.currency || '$')})
            </p>
            <p className="text-sm text-blue-600 mt-1">
              All amounts will be displayed in this currency
            </p>
            {currencyLoading && (
              <p className="text-sm text-blue-500 mt-2">Updating currency...</p>
            )}
          </div>
        </div>

        {/* Emails, Phone, Addresses */}
        <div className="md:col-span-2 space-y-8">
          {/* Emails */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-900">Emails</h4>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Primary</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <span className="text-gray-400 font-medium">Cannot change</span>
              </div>
            </div>
          </div>

          {/* Phone Numbers */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-900">Phone numbers</h4>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.92 7.02C17.45 6.18 16.84 5.55 16.08 5.12C15.51 4.82 15.01 4.53 14.68 4.18C14.77 3.88 14.85 3.52 14.85 3.01C14.85 1.9 14.02 1 12.91 1C11.8 1 10.97 1.9 10.97 3.01C10.97 3.52 11.05 3.88 11.14 4.18C10.81 4.53 10.31 4.82 9.74 5.12C8.98 5.55 8.37 6.18 7.9 7.02C7.57 7.57 7.3 8.15 7.07 8.64C7.02 8.23 6.97 7.82 6.97 7.4C6.97 3.9 9.84 1 13.34 1C16.84 1 19.71 3.9 19.71 7.4C19.71 7.8 19.66 8.2 19.61 8.59C19.38 8.15 19.11 7.57 18.78 7.02C18.77 7.02 17.92 7.02 17.92 7.02ZM20 16C20 13.79 18.21 12 16 12C13.79 12 12 13.79 12 16C12 18.21 13.79 20 16 20C18.21 20 20 18.21 20 16Z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Primary</p>
                    <p className="text-sm text-gray-600">{formatPhone(user.phone)}</p>
                    <p className="text-xs text-gray-500">Mobile</p>
                  </div>
                </div>
                {editingField === 'phone' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone"
                    />
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit('phone', user.phone)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Change
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-900">Addresses</h4>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Primary</p>
                    {editingField === 'address' ? (
                      <textarea
                        value={formData.address || ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your address"
                        rows="3"
                      />
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">{user.address || 'No address set'}</p>
                        <p className="text-sm text-gray-600">{user.nationality || ''}</p>
                      </>
                    )}
                  </div>
                </div>
                {editingField === 'address' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit('address', user.address)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {user.address ? 'Edit' : 'Add'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}