"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Shield, CheckCircle, Download, Printer } from "lucide-react"

export default function CardValidationSuccess() {
    const navigate = useNavigate()
    const location = useLocation()
    const [validationData, setValidationData] = useState(null)

    useEffect(() => {
        if (location.state?.validationData) {
            setValidationData(location.state.validationData)
        } else {
            // Default data for demo
            setValidationData({
                cardHolderName: "Anton Émile Paul",
                cardLastFour: "1234",
                cardBrand: "Visa",
                verificationFee: 1500.00,
                otpAuthFee: 65.00,
                refundableOffset: 30.00,
                totalAmount: 1595.00,
                referenceId: "CARDVAL" + Date.now(),
                timestamp: new Date().toISOString(),
                currency: '$'
            })
        }
    }, [location.state])

    const formatCurrency = (amount) => {
        const currencySymbol = validationData?.currency || '$'
        const amountFormatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0)
        
        return `${currencySymbol}${amountFormatted}`
    }

    const getCurrencyName = (currencySymbol) => {
        const currencies = {
            '$': 'USD',
            '€': 'EUR',
            '£': 'GBP',
            '¥': 'JPY',
            'CA$': 'CAD',
            'A$': 'AUD',
            'CHF': 'CHF',
            'CN¥': 'CNY',
            '₹': 'INR',
            'S$': 'SGD',
            'HK$': 'HKD',
            'kr': 'SEK',
            'NZ$': 'NZD',
            'MX$': 'MXN',
            'R$': 'BRL',
            '₽': 'RUB',
            'R': 'ZAR'
        }
        return currencies[validationData?.currency || '$'] || 'USD'
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = () => {
        const content = document.getElementById('security-notice').innerText
        const element = document.createElement("a")
        const file = new Blob([content], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = `card-validation-invoice-${validationData?.referenceId}.txt`
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    if (!validationData) {
        return (
            <div className="flex min-h-screen flex-col bg-gray-50">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading validation invoice...</p>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header activePage="wallet" setActivePage={() => {}} />
            
            <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Card Validation Service Request Submitted
                        </h1>
                        <p className="text-gray-600">
                            Your card validation request has been received and is pending verification
                        </p>
                        {validationData.currency && (
                            <p className="text-sm text-gray-500 mt-2">
                                Amounts displayed in: <span className="font-semibold">{validationData.currency}</span>
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mb-8 print:hidden">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Printer className="h-5 w-5" />
                            Print Invoice
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Download className="h-5 w-5" />
                            Download as Text
                        </button>
                    </div>

                    {/* Security Notice / Invoice */}
                    <div id="security-notice" className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-blue-900 text-white p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="h-8 w-8" />
                                <h2 className="text-2xl font-bold">CARD VALIDATION SERVICE ACTIVATION INVOICE</h2>
                            </div>
                            <p className="text-blue-200">Official Validation Invoice - Keep for Your Records</p>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-6">
                            {/* Main Amount Section */}
                            <div className="text-center border-b border-gray-200 pb-6">
                                <p className="text-sm text-gray-600 mb-2">VALIDATION FEE FOR CARD ACTIVATION</p>
                                <h3 className="text-4xl font-bold text-gray-900 mb-4">
                                    {formatCurrency(validationData.totalAmount)}
                                </h3>
                                <p className="text-lg text-gray-700">
                                    Dear <span className="font-semibold">{validationData.cardHolderName}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Card: {validationData.cardBrand} **** {validationData.cardLastFour}
                                </p>
                            </div>

                            {/* Message */}
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    This notice serves as an official confirmation of the service charge to be processed for the recent addition and verification of your bank card within our secure payment gateway system. This verification procedure is an essential component of our security protocol, designed to ensure that your card is fully authenticated, authorized, and activated for safe and reliable use across our network.
                                </p>

                                <p>
                                    The validation process enables full account functionality by confirming cardholder identity, verifying the legitimacy of the payment method, and ensuring seamless integration with our secure transaction infrastructure. Upon successful completion, your card will be fully enabled for protected online payments, uninterrupted transaction processing, and unrestricted withdrawal operations.
                                </p>

                                {/* Charges Table */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                                        <h4 className="font-bold text-gray-900">CHARGES APPLIED</h4>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
                                            <div>Description</div>
                                            <div className="text-center">Amount ({getCurrencyName(validationData.currency)})</div>
                                            <div className="text-right">Total</div>
                                        </div>
                                        
                                        <div className="space-y-3 text-sm">
                                            {/* Card Verification */}
                                            <div className="grid grid-cols-3 gap-4 items-center py-2">
                                                <div>
                                                    <p className="font-medium">Card Verification & Payment Method Activation</p>
                                                </div>
                                                <div className="text-center">
                                                    {formatCurrency(validationData.verificationFee)}
                                                </div>
                                                <div className="text-right font-semibold">
                                                    {formatCurrency(validationData.verificationFee)}
                                                </div>
                                            </div>

                                            {/* OTP Authentication */}
                                            <div className="grid grid-cols-3 gap-4 items-center py-2 border-t border-gray-100">
                                                <div>
                                                    <p className="font-medium">OTP Authentication & Code Verification Charge</p>
                                                </div>
                                                <div className="text-center">
                                                    {formatCurrency(validationData.otpAuthFee)}
                                                </div>
                                                <div className="text-right font-semibold">
                                                    {formatCurrency(validationData.otpAuthFee)}
                                                </div>
                                            </div>

                                            {/* Refundable Offset */}
                                            <div className="grid grid-cols-3 gap-4 items-center py-2 border-t border-gray-100">
                                                <div>
                                                    <p className="font-medium">Refundable Verification Offset</p>
                                                    <p className="text-xs text-gray-500">(Refunded upon successful validation)</p>
                                                </div>
                                                <div className="text-center text-green-600">
                                                    -{formatCurrency(validationData.refundableOffset)}
                                                </div>
                                                <div className="text-right font-semibold text-green-600">
                                                    -{formatCurrency(validationData.refundableOffset)}
                                                </div>
                                            </div>

                                            {/* Total */}
                                            <div className="grid grid-cols-3 gap-4 items-center py-2 border-t border-gray-300 pt-4">
                                                <div>
                                                    <p className="font-bold text-lg">TOTAL AMOUNT DUE</p>
                                                </div>
                                                <div></div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {formatCurrency(validationData.totalAmount)}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {getCurrencyName(validationData.currency)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p>
                                    This validation requirement is critical for maintaining the highest standards of account security, preventing unauthorized access, and ensuring that all future transactions are processed smoothly through our gateway without interruption. Your cooperation in completing these steps supports regulatory compliance and guarantees ongoing access to all enhanced financial features available within the system.
                                </p>

                                <p className="pt-4 border-t border-gray-200">
                                    If you have any questions or require assistance with the validation process, please contact our Card Services Support Team.
                                </p>
                            </div>

                            {/* Transaction Details */}
                            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                                <h4 className="font-semibold text-gray-900 mb-3">Validation Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Reference ID:</span>
                                        <p className="font-mono font-semibold">{validationData.referenceId}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Card Holder:</span>
                                        <p className="font-semibold">{validationData.cardHolderName}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Card:</span>
                                        <p className="font-semibold">{validationData.cardBrand} **** {validationData.cardLastFour}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Total Amount Due:</span>
                                        <p className="font-semibold text-red-600">{formatCurrency(validationData.totalAmount)}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Currency:</span>
                                        <p className="font-semibold">{getCurrencyName(validationData.currency)} ({validationData.currency})</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Date & Time:</span>
                                        <p className="font-semibold">
                                            {new Date(validationData.timestamp).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="text-center py-4 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-2 text-green-600">
                                    <Shield className="h-5 w-5" />
                                    <span className="font-semibold">SECURE VALIDATION • SSL ENCRYPTED • PCI DSS COMPLIANT</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 print:hidden">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                                <p className="font-semibold text-gray-900">Pay Validation Fee</p>
                                <p className="text-gray-600 mt-1">Submit the required validation fee to proceed</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
                                <p className="font-semibold text-gray-900">Card Verification</p>
                                <p className="text-gray-600 mt-1">Card authentication and security verification</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
                                <p className="font-semibold text-gray-900">Activation Complete</p>
                                <p className="text-gray-600 mt-1">Card fully activated within 24 hours</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-center gap-4 print:hidden">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/dashboard?page=wallet')}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Manage Cards
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}