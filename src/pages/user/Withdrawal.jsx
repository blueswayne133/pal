// Withdrawal.jsx
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { CreditCard, ArrowUpRight, Landmark, Building, Globe, User } from "lucide-react"
import api from "../../utils/api"

export default function Withdrawal() {
    const [activeTab, setActiveTab] = useState("request")
    const [amount, setAmount] = useState("")
    const [method, setMethod] = useState("bank_transfer")
    const [loading, setLoading] = useState(false)
    const [withdrawals, setWithdrawals] = useState([])
    const [userInfo, setUserInfo] = useState(null)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [clearanceFee, setClearanceFee] = useState(0) // Clearance fee state
    const [fetchingFee, setFetchingFee] = useState(true) // Loading state for fee fetch
    
    // Bank form fields
    const [bankName, setBankName] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [routingNumber, setRoutingNumber] = useState("")
    const [swiftCode, setSwiftCode] = useState("")
    const [iban, setIban] = useState("")
    const [bankCountry, setBankCountry] = useState("")
    const [accountHolderName, setAccountHolderName] = useState("")
    
    const navigate = useNavigate()

    const withdrawalMethods = [
        {
            id: "bank_transfer",
            name: "Bank Transfer",
            icon: Landmark,
            description: "Domestic bank transfer",
            processingTime: "1-3 business days",
            fee: "2.9% + $0.30 + Clearance Fee",
            requiresRouting: true
        },
        {
            id: "wire_transfer",
            name: "Wire Transfer",
            icon: Globe,
            description: "International wire transfer",
            processingTime: "2-5 business days",
            fee: "2.9% + $0.30 + Clearance Fee",
            requiresSwift: true
        },
        {
            id: "paypal",
            name: "PayPal",
            icon: CreditCard,
            description: "Transfer to PayPal account",
            processingTime: "1-2 business days",
            fee: "2.9% + $0.30 + Clearance Fee",
            requiresPaypal: false
        },
        {
            id: "crypto",
            name: "Cryptocurrency",
            icon: Building,
            description: "Transfer to crypto wallet",
            processingTime: "Instant",
            fee: "2.9% + $0.30 + Clearance Fee",
            requiresWallet: false
        }
    ]

    useEffect(() => {
        fetchUserProfile()
        fetchWithdrawals()
        fetchClearanceFee() // Fetch the actual clearance fee set by admin
    }, [])

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/user/profile')
            if (response.data.success) {
                setUserInfo(response.data.data.user)
            }
        } catch (error) {
            console.error('Error fetching user profile:', error)
        }
    }

    const fetchWithdrawals = async () => {
        try {
            const response = await api.get('/user/withdrawals')
            if (response.data.success) {
                setWithdrawals(response.data.data.data || response.data.data)
            }
        } catch (error) {
            console.error('Error fetching withdrawals:', error)
        }
    }

    // Fetch clearance fee from backend
    const fetchClearanceFee = async () => {
        try {
            setFetchingFee(true)
            // Since we don't have a direct endpoint for users to get clearance fee,
            // we'll use the withdrawal info endpoint or create a new one
            const response = await api.get('/user/withdrawal-info')
            if (response.data.success) {
                // If the API returns clearance fee in the response
                if (response.data.data.clearance_fee !== undefined) {
                    setClearanceFee(parseFloat(response.data.data.clearance_fee))
                } else {
                    // Fallback: Fetch from system settings (admin endpoint)
                    // Note: In production, you should create a user-facing endpoint for this
                    try {
                        const adminResponse = await api.get('/user/clearance-fee')
                        if (adminResponse.data.success) {
                            setClearanceFee(parseFloat(adminResponse.data.data.clearance_fee))
                        }
                    } catch (adminError) {
                        console.error('Error fetching clearance fee from admin endpoint:', adminError)
                        // Use default value if both endpoints fail
                        setClearanceFee(25.00)
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching clearance fee:', error)
            // Use default value if API call fails
            setClearanceFee(25.00)
        } finally {
            setFetchingFee(false)
        }
    }

    // Calculate base processing fee (2.9% + $0.30)
    const calculateBaseFee = (amount) => {
        return (amount * 0.029) + 0.30
    }

    // Calculate total fees (base fee + clearance fee)
    const calculateTotalFees = (amount) => {
        return calculateBaseFee(amount) + clearanceFee
    }

    // Calculate net amount user receives
    const calculateNetAmount = (amount) => {
        return amount - calculateTotalFees(amount)
    }

    const handleWithdrawal = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        // Basic validation for all methods
        if (!bankName || !accountNumber || !accountHolderName || !bankCountry) {
            setError("Please fill in all required bank details")
            setLoading(false)
            return
        }

        // Method-specific validation
        if (method === 'bank_transfer' && !routingNumber) {
            setError("Routing number is required for bank transfers")
            setLoading(false)
            return
        }

        if (method === 'wire_transfer' && !swiftCode) {
            setError("SWIFT code is required for wire transfers")
            setLoading(false)
            return
        }

        // Check if net amount is positive
        const netAmount = calculateNetAmount(parseFloat(amount))
        if (netAmount <= 0) {
            setError("Withdrawal amount is too small after fees")
            setLoading(false)
            return
        }

        try {
            const withdrawalData = {
                amount: parseFloat(amount),
                method: method,
                bank_name: bankName,
                account_number: accountNumber,
                routing_number: routingNumber || null,
                swift_code: swiftCode || null,
                iban: iban || null,
                bank_country: bankCountry,
                account_holder_name: accountHolderName
            }

            console.log('Sending withdrawal data:', withdrawalData)

            const response = await api.post('/user/withdrawal', withdrawalData)

            if (response.data.success) {
                // Navigate to success page with withdrawal data
                navigate('/withdrawal/success', {
                    state: {
                        withdrawalData: {
                            amount: parseFloat(amount),
                            baseFee: calculateBaseFee(parseFloat(amount)),
                            clearanceFee: clearanceFee,
                            totalFees: calculateTotalFees(parseFloat(amount)),
                            netAmount: netAmount,
                            userName: accountHolderName,
                            referenceId: response.data.data?.withdrawal?.reference_id || 'PPWD' + Date.now(),
                            timestamp: new Date().toISOString(),
                            currency: userInfo?.currency || '$'
                        }
                    }
                })
            }
        } catch (err) {
            console.error('Withdrawal error details:', err.response?.data)
            console.error('Withdrawal error:', err)
            
            // Handle validation errors specifically
            if (err.response?.status === 422 && err.response?.data?.errors) {
                const validationErrors = err.response.data.errors
                const firstError = Object.values(validationErrors)[0][0]
                setError(firstError || 'Please check your withdrawal details')
            } else if (err.response?.status === 500) {
                setError('Server error occurred. Please try again or contact support.')
            } else {
                setError(err.response?.data?.message || 'Withdrawal request failed')
            }
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        const currencySymbol = userInfo?.currency || '$'
        const amountFormatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0)
        
        return `${currencySymbol}${amountFormatted}`
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100'
            case 'pending': return 'text-yellow-600 bg-yellow-100'
            case 'processing': return 'text-blue-600 bg-blue-100'
            case 'failed': return 'text-red-600 bg-red-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    const resetForm = () => {
        setAmount("")
        setBankName("")
        setAccountNumber("")
        setRoutingNumber("")
        setSwiftCode("")
        setIban("")
        setBankCountry("")
        setAccountHolderName("")
        setError("")
        setSuccess("")
    }

    // Get currency symbol for input placeholder
    const getCurrencySymbol = () => {
        return userInfo?.currency || '$'
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
        
            <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-8">
                {/* Tabs */}
                <div className="mb-8 border-b border-gray-200">
                    <div className="-mb-px flex gap-8">
                        <button
                            onClick={() => setActiveTab("request")}
                            className={`border-b-2 px-1 py-4 font-medium transition-colors ${
                                activeTab === "request"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Request Withdrawal
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`border-b-2 px-1 py-4 font-medium transition-colors ${
                                activeTab === "history"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Withdrawal History
                        </button>
                    </div>
                </div>

                {activeTab === "request" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Withdrawal Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Withdrawal</h2>
                                
                                {/* Currency Display */}
                                {userInfo?.currency && (
                                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-700">
                                            Amounts displayed in: <span className="font-semibold">{userInfo.currency}</span>
                                        </p>
                                    </div>
                                )}

                                {/* Clearance Fee Loading */}
                                {fetchingFee && (
                                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <p className="text-sm text-yellow-700">
                                            Loading current clearance fee...
                                        </p>
                                    </div>
                                )}
                                
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-700">{error}</p>
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-700">{success}</p>
                                    </div>
                                )}

                                <form onSubmit={handleWithdrawal} className="space-y-6">
                                    {/* Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Amount
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-500">{getCurrencySymbol()}</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="10"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">Minimum withdrawal: {formatCurrency(10)}</p>
                                    </div>

                                    {/* Method Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Withdrawal Method
                                        </label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {withdrawalMethods.map((methodItem) => (
                                                <div
                                                    key={methodItem.id}
                                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                                        method === methodItem.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                    onClick={() => setMethod(methodItem.id)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                                <methodItem.icon className="h-6 w-6 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900">
                                                                    {methodItem.name}
                                                                </h3>
                                                                <p className="text-sm text-gray-600">
                                                                    {methodItem.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right text-sm text-gray-600">
                                                            <p>Fee: {methodItem.fee}</p>
                                                            <p>Processing: {methodItem.processingTime}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Fee Calculation */}
                                    {amount && parseFloat(amount) >= 10 && (
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <h4 className="font-semibold text-gray-900 mb-3">Fee Breakdown</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Withdrawal Amount:</span>
                                                    <span className="font-semibold">{formatCurrency(parseFloat(amount))}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Processing Fee (2.9% + $0.30):</span>
                                                    <span className="text-red-600">{formatCurrency(calculateBaseFee(parseFloat(amount)))}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Clearance Fee (Fixed):</span>
                                                    <span className="text-red-600">{formatCurrency(clearanceFee)}</span>
                                                </div>
                                                <div className="flex justify-between border-t border-gray-300 pt-2 font-semibold">
                                                    <span>Total Fees:</span>
                                                    <span className="text-red-600">
                                                        {formatCurrency(calculateTotalFees(parseFloat(amount)))}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between font-semibold text-green-600 border-t border-gray-300 pt-2">
                                                    <span>You'll Receive:</span>
                                                    <span>
                                                        {formatCurrency(calculateNetAmount(parseFloat(amount)))}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bank Details Form */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            {method === 'paypal' ? 'PayPal Account Details' : 
                                             method === 'crypto' ? 'Crypto Wallet Details' : 'Bank Account Details'}
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Bank/Wallet Name */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {method === 'paypal' ? 'PayPal Email' :
                                                     method === 'crypto' ? 'Wallet Name' : 'Bank Name'} *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={bankName}
                                                    onChange={(e) => setBankName(e.target.value)}
                                                    placeholder={
                                                        method === 'paypal' ? 'Enter PayPal email address' :
                                                        method === 'crypto' ? 'Enter wallet name (e.g., MetaMask, Trust Wallet)' :
                                                        'Enter bank name'
                                                    }
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>

                                            {/* Account Holder Name */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {method === 'crypto' ? 'Wallet Holder Name' : 'Account Holder Name'} *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={accountHolderName}
                                                    onChange={(e) => setAccountHolderName(e.target.value)}
                                                    placeholder={
                                                        method === 'crypto' ? 'Enter wallet holder name' :
                                                        'Enter account holder name'
                                                    }
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>

                                            {/* Account Number / Wallet Address */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {method === 'paypal' ? 'PayPal Email' :
                                                     method === 'crypto' ? 'Wallet Address' : 'Account Number'} *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={accountNumber}
                                                    onChange={(e) => setAccountNumber(e.target.value)}
                                                    placeholder={
                                                        method === 'paypal' ? 'Enter PayPal email address' :
                                                        method === 'crypto' ? 'Enter crypto wallet address' :
                                                        'Enter account number'
                                                    }
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>

                                            {/* Routing Number (Bank Transfer) */}
                                            {method === 'bank_transfer' && (
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Routing Number *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={routingNumber}
                                                        onChange={(e) => setRoutingNumber(e.target.value)}
                                                        placeholder="Enter routing number"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>
                                            )}

                                            {/* SWIFT Code (Wire Transfer) */}
                                            {method === 'wire_transfer' && (
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        SWIFT/BIC Code *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={swiftCode}
                                                        onChange={(e) => setSwiftCode(e.target.value)}
                                                        placeholder="Enter SWIFT code"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>
                                            )}

                                            {/* IBAN (Optional for bank methods) */}
                                            {(method === 'bank_transfer' || method === 'wire_transfer') && (
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        IBAN (Optional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={iban}
                                                        onChange={(e) => setIban(e.target.value)}
                                                        placeholder="Enter IBAN"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            )}

                                            {/* Bank Country (For bank methods) */}
                                            {(method === 'bank_transfer' || method === 'wire_transfer') && (
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Bank Country *
                                                    </label>
                                                    <select
                                                        value={bankCountry}
                                                        onChange={(e) => setBankCountry(e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    >
                                                        <option value="">Select Country</option>
                                                        <option value="United States">United States</option>
                                                        <option value="United Kingdom">United Kingdom</option>
                                                        <option value="Canada">Canada</option>
                                                        <option value="Australia">Australia</option>
                                                        <option value="Germany">Germany</option>
                                                        <option value="France">France</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            )}

                                            {/* Crypto Network (For crypto method) */}
                                            {method === 'crypto' && (
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Crypto Network *
                                                    </label>
                                                    <select
                                                        value={bankCountry}
                                                        onChange={(e) => setBankCountry(e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    >
                                                        <option value="">Select Network</option>
                                                        <option value="Ethereum">Ethereum (ERC-20)</option>
                                                        <option value="Bitcoin">Bitcoin</option>
                                                        <option value="Binance">Binance Smart Chain (BEP-20)</option>
                                                        <option value="Polygon">Polygon</option>
                                                        <option value="Solana">Solana</option>
                                                        <option value="Other">Other Network</option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                                        >
                                            Clear Form
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading || !amount || parseFloat(amount) < 10 || calculateNetAmount(parseFloat(amount)) <= 0 || fetchingFee}
                                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {loading ? 'Processing...' : 'Request Withdrawal'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Info Panel */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Withdrawal Information</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Minimum Amount:</span>
                                        <span className="font-semibold">{formatCurrency(10)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Processing Time:</span>
                                        <span className="font-semibold">
                                            {method === 'wire_transfer' ? '2-5 business days' : 
                                             method === 'paypal' ? '1-2 business days' :
                                             method === 'crypto' ? 'Instant' : '1-3 business days'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Processing Fee:</span>
                                        <span className="font-semibold">2.9% + $0.30</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Clearance Fee:</span>
                                        <span className="font-semibold">
                                            {fetchingFee ? 'Loading...' : `${formatCurrency(clearanceFee)} (Fixed)`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h4 className="font-semibold text-yellow-800 mb-2">Security Notice</h4>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                    <li>• Your details are encrypted and secure</li>
                                    <li>• Withdrawals are processed manually for security</li>
                                    <li>• Clearance fee is required for all transactions</li>
                                    <li>• Contact support for urgent withdrawals</li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-800 mb-2">About Clearance Fee</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Fixed amount set by administration</li>
                                    <li>• Applied to all withdrawal requests</li>
                                    <li>• Covers security and processing costs</li>
                                    <li>• Non-negotiable and mandatory</li>
                                    <li>• Updated automatically by admin</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "history" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Withdrawal History</h2>
                            {userInfo?.currency && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Amounts displayed in: {userInfo.currency}
                                </p>
                            )}
                        </div>

                        {withdrawals.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {withdrawals.map((withdrawal) => (
                                    <div key={withdrawal.id} className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <ArrowUpRight className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {withdrawal.method.replace('_', ' ').toUpperCase()} Withdrawal
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        To: {withdrawal.bank_name} • {withdrawal.account_holder_name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Reference: {withdrawal.reference_id}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {formatDate(withdrawal.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-red-600">
                                                    -{formatCurrency(withdrawal.amount)}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Fee: {formatCurrency(withdrawal.fee)}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Clearance: {formatCurrency(withdrawal.clearance_fee || 0)}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Net: {formatCurrency(withdrawal.net_amount)}
                                                </p>
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                                                    {withdrawal.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <ArrowUpRight className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No Withdrawals Yet
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    You haven't made any withdrawal requests yet.
                                </p>
                                <button
                                    onClick={() => setActiveTab("request")}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Make your first withdrawal
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}