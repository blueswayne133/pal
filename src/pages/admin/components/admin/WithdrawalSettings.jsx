"use client"

import { useState, useEffect } from "react"
import { Save, DollarSign } from "lucide-react"
import api from "../../../../utils/api"

export default function WithdrawalSettings() {
  const [clearanceFee, setClearanceFee] = useState("0.00")
  const [loading, setLoading] = useState(false)
  const [currentFee, setCurrentFee] = useState("0.00")

  useEffect(() => {
    fetchCurrentFee()
  }, [])

  const fetchCurrentFee = async () => {
    try {
      const response = await api.get('/admin/clearance-fee')
      if (response.data.success) {
        setCurrentFee(response.data.data.clearance_fee)
        setClearanceFee(response.data.data.clearance_fee)
      }
    } catch (error) {
      console.error('Failed to fetch clearance fee:', error)
    }
  }

  const handleSave = async () => {
    if (!clearanceFee || parseFloat(clearanceFee) < 0) {
      alert('Please enter a valid clearance fee')
      return
    }

    setLoading(true)
    try {
      const response = await api.put('/admin/clearance-fee', {
        clearance_fee: parseFloat(clearanceFee)
      })
      
      if (response.data.success) {
        setCurrentFee(clearanceFee)
        alert('Clearance fee updated successfully!')
      }
    } catch (error) {
      console.error('Failed to update clearance fee:', error)
      alert('Failed to update clearance fee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Withdrawal Settings</h1>
        <p className="text-gray-600 mt-1">Set fixed clearance fee for all withdrawals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Fee Display */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <DollarSign size={20} className="mr-2 text-green-600" />
            Current Clearance Fee
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">${currentFee}</div>
            <p className="text-sm text-gray-500 mt-2">
              This fee is automatically applied to all withdrawal requests
            </p>
          </div>
        </div>

        {/* Update Fee Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Update Clearance Fee</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Clearance Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={clearanceFee}
                onChange={(e) => setClearanceFee(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                This fixed amount will be added to all withdrawal fees
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={loading || clearanceFee === currentFee}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Updating...' : 'Update Clearance Fee'}
            </button>

            {clearanceFee !== currentFee && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> This will affect all future withdrawal requests. 
                  Current fee: <strong>${currentFee}</strong> → New fee: <strong>${clearanceFee}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">How Clearance Fee Works</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Fixed amount set by admin only</li>
          <li>• Automatically applied to ALL withdrawal requests</li>
          <li>• Users see this fee before submitting withdrawal</li>
          <li>• Cannot be modified by users</li>
          <li>• Added to the base transaction fee</li>
        </ul>
      </div>
    </div>
  )
}