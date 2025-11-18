import { Smartphone } from 'lucide-react'
import { useState } from 'react'
import api from '../../../../utils/api'
import PhoneVerificationModal from './PhoneVerificationModal'

export default function MobilePhoneCard({ user, onUpdate }) {
  const [showAddPhone, setShowAddPhone] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const hasPhoneVerified = Boolean(user?.phone)

  const handleAddPhone = async () => {
    if (!phone) return
    
    setLoading(true)
    try {
      const response = await api.post('/user/phone', { phone })
      
      if (response.data.success) {
        setShowAddPhone(false)
        alert('Phone number added successfully!')
        onUpdate?.() // Refresh user data so phone is visible
      }
    } catch (error) {
      console.error('Failed to add phone:', error)
      alert(error.response?.data?.message || 'Failed to add phone number')
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationComplete = () => {
    setShowVerification(false)
    setPhone('')
    onUpdate?.() 
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex gap-4">
        <div className="flex-shrink-0 bg-gray-700 text-white p-3 rounded-lg h-fit">
          <Smartphone size={32} />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">
            {hasPhoneVerified ? 'Mobile phone verified' : 'Confirm your mobile phone'}
          </h3>

          <p className="text-gray-600 text-sm mt-1">
            {hasPhoneVerified 
              ? `Your mobile phone ${user.phone} is verified and ready for account recovery.`
              : user?.phone
                ? `Your phone number is added. Please verify to enable account recovery.`
                : 'Make it easier to recover your password.'
            }
          </p>

          {successMsg && (
            <p className="text-green-600 text-sm mt-2">{successMsg}</p>
          )}

          {/* Only show button when NOT verified */}
          {!hasPhoneVerified && (
            <button 
              onClick={() => setShowAddPhone(true)}
              className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {user?.phone ? 'Verify mobile phone' : 'Add mobile phone'}
            </button>
          )}
        </div>
      </div>

      {/* Add Phone Modal */}
      {showAddPhone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add Mobile Phone</h3>
            <p className="text-gray-600 text-sm mb-4">
              We'll send a verification code to your phone number.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowAddPhone(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPhone}
                  disabled={loading || !phone}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerification && (
        <PhoneVerificationModal 
          onClose={() => setShowVerification(false)}
          onVerified={handleVerificationComplete}
        />
      )}
    </>
  )
}
