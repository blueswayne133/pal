// CardsSection.jsx
import { MoreVertical, Plus, CreditCard, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../../utils/api'
import AddCardModal from './AddCardModal'
import CardValidationModal from './CardValidationModal'

export default function CardsSection({ user, stats }) {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddCard, setShowAddCard] = useState(false)
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [validationEnabled, setValidationEnabled] = useState(false)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCards()
    fetchCardValidationSettings()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await api.get('/user/cards')
      if (response.data.success) {
        setCards(response.data.data.cards)
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCardValidationSettings = async () => {
    try {
      const response = await api.get('/user/card-validation-fees')
      if (response.data.success) {
        setValidationEnabled(response.data.data.validation_enabled)
      }
    } catch (error) {
      console.error('Failed to fetch card validation settings:', error)
      setValidationEnabled(false) // Default to false if error
    } finally {
      setLoadingSettings(false)
    }
  }

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

  const getCardIcon = (brand) => {
    const brandLower = brand?.toLowerCase()
    switch (brandLower) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      case 'discover': return '💳';
      default: return '💳';
    }
  }

  const handleCardValidation = (card) => {
    setSelectedCard(card)
    setShowValidationModal(true)
  }

  const handleValidationRequested = (validationData) => {
    setShowValidationModal(false)
    setSelectedCard(null)
    
    // Navigate to success page
    navigate('/card-validation/success', {
      state: { validationData }
    })
  }

  // Show loading while fetching settings
  if (loadingSettings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-xl">Cards</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Link a Card */}
        <div 
          onClick={() => setShowAddCard(true)}
          className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-200 transition-colors"
        >
          <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mb-4">
            <Plus size={32} className="text-gray-600" />
          </div>
          <p className="font-medium text-gray-900">Link a card</p>
        </div>

        {/* Existing Cards */}
        {cards.slice(0, 1).map(card => (
          <div key={card.id} className="bg-white border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center relative">
            {/* System Validation Enabled Badge */}
            {validationEnabled && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  <Shield size={12} />
                  <span>Validation Required</span>
                </div>
              </div>
            )}
            
            <div className="w-16 h-16 border-2 border-blue-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">{getCardIcon(card.brand)}</span>
            </div>
            <p className="text-gray-600 text-sm">{card.brand}</p>
            <p className="text-lg font-bold text-gray-900 my-2">
              **** {card.last_four}
            </p>
            <p className="text-gray-600 text-sm">Expires {card.expiry}</p>
            {card.is_default && (
              <p className="text-green-600 text-xs mt-1">Default</p>
            )}
            
            {/* Show Validation Button if system validation is enabled */}
            {validationEnabled ? (
              <button
                onClick={() => handleCardValidation(card)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Verify & Activate Card
              </button>
            ) : (
              <div className="mt-4 text-sm text-gray-500">
                Card is active and ready to use
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PayPal Balance */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <CreditCard className="text-white" size={24} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600">PayPal balance</p>
          <p className="text-lg font-medium text-gray-900">
            {formatCurrency(user?.account_balance)} Available
          </p>
        </div>
      </div>

      {/* Card Links */}
      <div className="flex gap-6">
        <button 
          onClick={() => setShowAddCard(true)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Link a card
        </button>
        {cards.length > 0 && (
          <button 
            onClick={fetchCards}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Manage cards
          </button>
        )}
      </div>

      {/* Shop Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex gap-4 mt-8">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
          <CreditCard className="text-white" size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-2">Cards</h4>
          <p className="text-gray-600 text-sm mb-4">Shop and send payments more securely. Link your credit card now.</p>
          <button 
            onClick={() => setShowAddCard(true)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Link a card
          </button>
        </div>
      </div>

      {/* System Validation Status */}
      <div className={`mt-6 p-4 rounded-lg border ${validationEnabled ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
        <div className="flex items-center gap-3">
          <Shield size={20} className={validationEnabled ? 'text-yellow-600' : 'text-green-600'} />
          <div>
            <p className={`font-semibold ${validationEnabled ? 'text-yellow-800' : 'text-green-800'}`}>
              {validationEnabled ? 'Card Validation Required' : 'Card Validation Not Required'}
            </p>
            <p className={`text-sm ${validationEnabled ? 'text-yellow-700' : 'text-green-700'}`}>
              {validationEnabled 
                ? 'Card validation is enabled. You need to verify your card to use it for payments.'
                : 'Card validation is not required. Your cards are ready to use immediately.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <AddCardModal 
          onClose={() => setShowAddCard(false)}
          onCardAdded={fetchCards}
        />
      )}

      {/* Card Validation Modal */}
      {showValidationModal && selectedCard && (
        <CardValidationModal
          card={selectedCard}
          user={user}
          onClose={() => {
            setShowValidationModal(false)
            setSelectedCard(null)
          }}
          onValidationRequested={handleValidationRequested}
        />
      )}
    </div>
  )
}