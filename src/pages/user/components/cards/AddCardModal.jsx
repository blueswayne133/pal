// AddCardModal.jsx - Compact & Responsive Version
import { useState, useEffect } from 'react'
import { X, CreditCard, Lock, Shield, Check, ChevronRight, Eye, EyeOff, User, Calendar, MapPin } from 'lucide-react'
import api from '../../../../utils/api'

export default function AddCardModal({ onClose, onCardAdded }) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [showCvv, setShowCvv] = useState(false)
  const [formData, setFormData] = useState({
    card_holder_name: '',
    card_number: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
    zip_code: ''
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [cardType, setCardType] = useState('')

  const handleChange = (field, value) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }

    if (field === 'card_number') {
      const cleaned = value.replace(/\s/g, '')
      if (/^4/.test(cleaned)) setCardType('visa')
      else if (/^5[1-5]/.test(cleaned)) setCardType('mastercard')
      else if (/^3[47]/.test(cleaned)) setCardType('amex')
      else if (/^6(?:011|5)/.test(cleaned)) setCardType('discover')
      else setCardType('')
    }
  }

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    const groups = cleaned.match(/.{1,4}/g)
    return groups ? groups.join(' ').slice(0, 19) : ''
  }

  const handleCardNumberChange = (value) => {
    const formatted = formatCardNumber(value)
    handleChange('card_number', formatted)
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.card_holder_name.trim()) errors.card_holder_name = 'Name required'
    if (!formData.card_number.replace(/\s/g, '')) errors.card_number = 'Card number required'
    else if (formData.card_number.replace(/\s/g, '').length < 16) errors.card_number = 'Enter 16 digits'
    if (!formData.expiry_month) errors.expiry_month = 'Month required'
    if (!formData.expiry_year) errors.expiry_year = 'Year required'
    if (!formData.cvv) errors.cvv = 'CVV required'
    if (!formData.zip_code) errors.zip_code = 'ZIP required'
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setLoading(true)
    setStep(2)

    try {
      const submitData = {
        ...formData,
        card_number: formData.card_number.replace(/\s/g, '')
      }

      await new Promise(resolve => setTimeout(resolve, 2000))
      const response = await api.post('/user/cards', submitData)
      
      if (response.data.success) {
        setStep(3)
        setTimeout(() => {
          onCardAdded()
          onClose()
        }, 3000)
      }
    } catch (error) {
      console.error('Failed to add card:', error)
      setStep(1)
      alert(error.response?.data?.message || 'Failed to add card. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)

  const getCardTypeName = () => {
    switch (cardType) {
      case 'visa': return 'Visa'
      case 'mastercard': return 'Mastercard'
      case 'amex': return 'Amex'
      case 'discover': return 'Discover'
      default: return 'Card'
    }
  }

  const maskCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '')
    return `**** ${cleaned.slice(-4)}`
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-3 sm:p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Add Card</h2>
                <p className="text-blue-100 text-xs">Secure payment method</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center gap-2">
                <div className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold
                  ${step >= stepNum 
                    ? 'bg-white text-blue-600 shadow' 
                    : 'bg-white/20 text-white border border-white/30'
                  }
                `}>
                  {step > stepNum ? <Check size={14} /> : stepNum}
                </div>
                <span className={`text-xs ${step >= stepNum ? 'text-white' : 'text-blue-200'} hidden sm:block`}>
                  {stepNum === 1 ? 'Details' : stepNum === 2 ? 'Verify' : 'Done'}
                </span>
                {stepNum < 3 && (
                  <div className={`h-0.5 w-4 ${step > stepNum ? 'bg-white' : 'bg-white/30'} hidden sm:block`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Card Preview */}
          {step === 1 && (
            <div className="mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg sm:rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Card Number</p>
                    <div className="font-mono tracking-wider text-base sm:text-lg">
                      {formData.card_number || '•••• •••• •••• ••••'}
                    </div>
                  </div>
                  {cardType && (
                    <div className="bg-white/10 px-2 py-1 rounded text-xs font-semibold">
                      {getCardTypeName()}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-400">Cardholder</p>
                    <p className="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-[180px]">
                      {formData.card_holder_name || 'YOUR NAME'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Expires</p>
                    <p className="font-medium text-sm sm:text-base">
                      {formData.expiry_month && formData.expiry_year 
                        ? `${formData.expiry_month.padStart(2, '0')}/${formData.expiry_year.slice(-2)}`
                        : 'MM/YY'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Form */}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                {/* Cardholder Name */}
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
                  />
                  {validationErrors.card_holder_name && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.card_holder_name}</p>
                  )}
                </div>

                {/* Card Number */}
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
                  />
                  {validationErrors.card_number && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.card_number}</p>
                  )}
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={formData.expiry_month}
                        onChange={(e) => handleChange('expiry_month', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Month</option>
                        {months.map(month => (
                          <option key={month} value={month}>
                            {month.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.expiry_year}
                        onChange={(e) => handleChange('expiry_year', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Year</option>
                        {years.map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    {(validationErrors.expiry_month || validationErrors.expiry_year) && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationErrors.expiry_month || validationErrors.expiry_year}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700">
                        CVV
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCvv(!showCvv)}
                        className="text-xs text-blue-600"
                      >
                        {showCvv ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <input
                      type={showCvv ? "text" : "password"}
                      maxLength={4}
                      value={formData.cvv}
                      onChange={(e) => handleChange('cvv', e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {validationErrors.cvv && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.cvv}</p>
                    )}
                  </div>
                </div>

                {/* ZIP Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={(e) => handleChange('zip_code', e.target.value)}
                    placeholder="90210"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {validationErrors.zip_code && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.zip_code}</p>
                  )}
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  Your card details are encrypted with bank-level security. We never store your CVV.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    'Add Card'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Verification */}
          {step === 2 && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center relative">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Verifying Card</h3>
              <p className="text-gray-600 text-sm mb-6">
                Securely verifying your {getCardTypeName()} card
              </p>

              <div className="space-y-3 mb-6">
                {['Validating card', 'Contacting bank', 'Securing card'].map((label, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                ))}
              </div>

              <div className="w-24 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 animate-[loading_2s_ease-in-out_infinite]"></div>
              </div>

              <p className="text-xs text-gray-500">This usually takes 10-20 seconds</p>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Card Added!</h3>
              <p className="text-gray-600 text-sm mb-4">
                Your {getCardTypeName()} card ending in {maskCardNumber(formData.card_number).slice(-4)} is ready.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-6 ${
                    cardType === 'visa' ? 'bg-blue-500' :
                    cardType === 'mastercard' ? 'bg-red-500' :
                    cardType === 'amex' ? 'bg-blue-400' : 'bg-orange-500'
                  } rounded flex items-center justify-center`}>
                    <span className="text-xs font-bold text-white">
                      {cardType === 'visa' ? 'VISA' : 
                       cardType === 'mastercard' ? 'MC' : 
                       cardType === 'amex' ? 'AMEX' : 'DS'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-sm">{getCardTypeName()}</p>
                    <p className="text-xs text-gray-600">**** {formData.card_number.replace(/\s/g, '').slice(-4)}</p>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <div>
                    <p className="text-gray-500">Cardholder</p>
                    <p className="font-medium">{formData.card_holder_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Expires</p>
                    <p className="font-medium">
                      {formData.expiry_month.padStart(2, '0')}/{formData.expiry_year.slice(-2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-gray-500 text-xs">
                <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                Redirecting in 3s...
              </div>
            </div>
          )}

          {/* Card Logos */}
          {step === 1 && (
            <div className="border-t border-gray-200 mt-6 pt-4">
              <p className="text-center text-xs text-gray-500 mb-3">We accept all major cards</p>
              <div className="flex items-center justify-center gap-3">
                {['VISA', 'MC', 'AMEX', 'DS'].map((logo) => (
                  <div key={logo} className="w-10 h-7 border border-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">{logo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}