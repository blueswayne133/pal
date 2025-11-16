// MobilePhoneCard.jsx
import { Smartphone } from 'lucide-react'

export default function MobilePhoneCard({ user }) {
  const hasPhoneVerified = user?.phone && user.phone_verified_at

  return (
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
            ? 'Your mobile phone is verified and ready for account recovery.'
            : 'Make it easier to recover your password.'
          }
        </p>
        {!hasPhoneVerified && (
          <button className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm">
            Add mobile phone
          </button>
        )}
      </div>
    </div>
  )
}