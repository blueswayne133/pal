"use client"

import { useState, useEffect } from "react"
import { Save, CreditCard, Shield, Smartphone, RefreshCw, CheckCircle } from "lucide-react"
import api from "../../../../utils/api"

export default function CardSettings() {
  const [settings, setSettings] = useState({
    card_verification_fee: "1500.00",
    card_otp_auth_fee: "65.00",
    card_refundable_offset: "30.00",
    card_validation_enabled: true,
    card_auto_activation: false
  })
  const [loading, setLoading] = useState(false)
  const [currentSettings, setCurrentSettings] = useState({})
  const [calculating, setCalculating] = useState(false)
  const [feeBreakdown, setFeeBreakdown] = useState(null)

  useEffect(() => {
    fetchSettings()
    calculateFees()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/card-validation-settings')
      if (response.data.success) {
        const data = response.data.data
        setCurrentSettings(data)
        setSettings({
          card_verification_fee: data.card_verification_fee,
          card_otp_auth_fee: data.card_otp_auth_fee,
          card_refundable_offset: data.card_refundable_offset,
          card_validation_enabled: data.card_validation_enabled === 'true',
          card_auto_activation: data.card_auto_activation === 'true'
        })
      }
    } catch (error) {
      console.error('Failed to fetch card settings:', error)
    }
  }

  const calculateFees = async () => {
    try {
      setCalculating(true)
      const response = await api.get('/admin/card-validation-fees')
      if (response.data.success) {
        setFeeBreakdown(response.data.data)
      }
    } catch (error) {
      console.error('Failed to calculate fees:', error)
    } finally {
      setCalculating(false)
    }
  }

  const handleSave = async () => {
    if (parseFloat(settings.card_refundable_offset) > parseFloat(settings.card_verification_fee) + parseFloat(settings.card_otp_auth_fee)) {
      alert('Refundable offset cannot exceed total fees')
      return
    }

    setLoading(true)
    try {
      const response = await api.put('/admin/card-validation-settings', {
        ...settings,
        card_validation_enabled: settings.card_validation_enabled,
        card_auto_activation: settings.card_auto_activation
      })
      
      if (response.data.success) {
        setCurrentSettings(settings)
        calculateFees()
        alert('Card validation settings updated successfully!')
      }
    } catch (error) {
      console.error('Failed to update card settings:', error)
      alert('Failed to update card settings')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount) || 0)
  }

  const calculateTotal = () => {
    const total = parseFloat(settings.card_verification_fee) + 
                  parseFloat(settings.card_otp_auth_fee) - 
                  parseFloat(settings.card_refundable_offset)
    return total.toFixed(2)
  }

  const hasChanges = () => {
    return JSON.stringify(settings) !== JSON.stringify({
      ...currentSettings,
      card_validation_enabled: currentSettings.card_validation_enabled === 'true',
      card_auto_activation: currentSettings.card_auto_activation === 'true'
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Card Validation Settings</h1>
        <p className="text-gray-600 mt-1">Configure card validation fees and activation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Settings Display */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CreditCard size={20} className="mr-2 text-blue-600" />
            Current Validation Fees
          </h3>
          
          {feeBreakdown && (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-100">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-blue-600" />
                  <span className="font-medium">Verification Fee:</span>
                </div>
                <span className="font-semibold">{formatCurrency(feeBreakdown.verification_fee)}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className="text-green-600" />
                  <span className="font-medium">OTP Auth Fee:</span>
                </div>
                <span className="font-semibold">{formatCurrency(feeBreakdown.otp_auth_fee)}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded border border-emerald-100">
                <div className="flex items-center gap-2">
                  <RefreshCw size={16} className="text-emerald-600" />
                  <span className="font-medium">Refundable Offset:</span>
                </div>
                <span className="font-semibold text-emerald-600">-{formatCurrency(feeBreakdown.refundable_offset)}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-100 rounded border border-blue-200 mt-4">
                <span className="font-bold text-gray-900">Total User Pays:</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(feeBreakdown.total_amount)}</span>
              </div>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Validation Service:</span>
                <span className={`font-semibold ${feeBreakdown?.validation_enabled ? 'text-green-600' : 'text-red-600'}`}>
                  {feeBreakdown?.validation_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Auto Activation:</span>
                <span className={`font-semibold ${settings.card_auto_activation ? 'text-green-600' : 'text-gray-600'}`}>
                  {settings.card_auto_activation ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Settings Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Update Validation Settings</h3>
          
          <div className="space-y-4">
            {/* Verification Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Verification Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.card_verification_fee}
                onChange={(e) => setSettings({...settings, card_verification_fee: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                One-time setup and security verification
              </p>
            </div>

            {/* OTP Auth Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OTP Authentication Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.card_otp_auth_fee}
                onChange={(e) => setSettings({...settings, card_otp_auth_fee: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Secure 2-factor authentication setup
              </p>
            </div>

            {/* Refundable Offset */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refundable Offset ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.card_refundable_offset}
                onChange={(e) => setSettings({...settings, card_refundable_offset: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Refunded upon successful validation
              </p>
            </div>

            {/* Toggle Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Enable Validation Service</p>
                  <p className="text-xs text-gray-500">Show validation option to users</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.card_validation_enabled}
                    onChange={(e) => setSettings({...settings, card_validation_enabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Auto Activation</p>
                  <p className="text-xs text-gray-500">Automatically activate cards after payment</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.card_auto_activation}
                    onChange={(e) => setSettings({...settings, card_auto_activation: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>

            {/* Total Preview */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Total Amount User Pays:</span>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(calculateTotal())}</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Verification:</span>
                  <span>{formatCurrency(settings.card_verification_fee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>OTP Auth:</span>
                  <span>{formatCurrency(settings.card_otp_auth_fee)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Refundable Offset:</span>
                  <span>-{formatCurrency(settings.card_refundable_offset)}</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading || calculating || !hasChanges()}
              className={`w-full px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center ${
                hasChanges() 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Updating...' : 
               !hasChanges() ? 'No Changes' : 
               'Update Card Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <CheckCircle size={18} className="mr-2" />
          How Card Validation Works
        </h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li className="flex items-start">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-xs font-bold text-blue-600">1</span>
            </div>
            <span><strong>Verification Fee:</strong> One-time charge for card setup and security verification</span>
          </li>
          <li className="flex items-start">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-xs font-bold text-green-600">2</span>
            </div>
            <span><strong>OTP Auth Fee:</strong> Additional charge for 2-factor authentication setup</span>
          </li>
          <li className="flex items-start">
            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-xs font-bold text-emerald-600">3</span>
            </div>
            <span><strong>Refundable Offset:</strong> Amount refunded to user after successful validation</span>
          </li>
          <li className="flex items-start">
            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-xs font-bold text-purple-600">4</span>
            </div>
            <span>Users pay total amount upfront for card activation</span>
          </li>
          <li className="flex items-start">
            <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-xs font-bold text-yellow-600">5</span>
            </div>
            <span>Refundable offset is automatically credited back to user account</span>
          </li>
        </ul>
      </div>

      {/* Fee Breakdown Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Current Fee Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-blue-600" />
              <span className="font-semibold">Verification Fee</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(settings.card_verification_fee)}</p>
            <p className="text-xs text-gray-600 mt-1">Card setup & security verification</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone size={18} className="text-green-600" />
              <span className="font-semibold">OTP Auth Fee</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(settings.card_otp_auth_fee)}</p>
            <p className="text-xs text-gray-600 mt-1">2-factor authentication setup</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={18} className="text-gray-600" />
              <span className="font-semibold">User Pays Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculateTotal())}</p>
            <p className="text-xs text-gray-600 mt-1">Total amount charged to user</p>
          </div>
        </div>
      </div>
    </div>
  )
}