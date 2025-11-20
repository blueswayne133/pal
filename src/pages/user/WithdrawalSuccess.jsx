"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Shield, CheckCircle, Download, Printer } from "lucide-react"

export default function WithdrawalSuccess() {
    const navigate = useNavigate()
    const location = useLocation()
    const [withdrawalData, setWithdrawalData] = useState(null)

    useEffect(() => {
        if (location.state?.withdrawalData) {
            setWithdrawalData(location.state.withdrawalData)
        } else {
            setWithdrawalData({
                amount: 252567.87,
                clearanceFee: 35256.87,
                userName: "Anton Émile Paul",
                referenceId: "PPWD" + Date.now(),
                timestamp: new Date().toISOString()
            })
        }
    }, [location.state])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount)
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = () => {
        const element = document.createElement("a")
        const file = new Blob([document.getElementById('security-notice').innerText], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = `paypal-security-notice-${withdrawalData?.referenceId}.txt`
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    if (!withdrawalData) {
        return (
            <div className="flex min-h-screen flex-col bg-gray-50">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading security notice...</p>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />

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
                            Withdrawal Request Submitted Successfully
                        </h1>
                        <p className="text-gray-600">
                            Your withdrawal request has been received and is pending clearance
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mb-8 print:hidden">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Printer className="h-5 w-5" />
                            Print Notice
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Download className="h-5 w-5" />
                            Download as Text
                        </button>
                    </div>

                    {/* Security Notice */}
                    <div id="security-notice" className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-blue-900 text-white p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="h-8 w-8" />
                                <h2 className="text-2xl font-bold">PAYPAL TRANSACTION SECURITY NOTICE</h2>
                            </div>
                            <p className="text-blue-200">Official Security Communication - Keep for Your Records</p>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-6">
                            {/* Main Amount Section */}
                            <div className="text-center border-b border-gray-200 pb-6">
                                <p className="text-sm text-gray-600 mb-2">CLEARANCE REQUIREMENT FOR WITHDRAWAL OF</p>
                                <h3 className="text-4xl font-bold text-gray-900 mb-4">
                                    {formatCurrency(withdrawalData.amount)}
                                </h3>
                                <p className="text-lg text-gray-700">
                                    Dear <span className="font-semibold">{withdrawalData.userName}</span>
                                </p>
                            </div>

                            {/* Message */}
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    We appreciate your recent withdrawal request of{" "}
                                    <strong>{formatCurrency(withdrawalData.amount)} USD</strong> from your PayPal account.
                                </p>

                                <p>
                                    To proceed with the release of this high-value transaction, PayPal's regulatory framework requires the settlement of a Mandatory High-Value Transaction Clearance Fee totaling{" "}
                                    <strong className="text-red-600">{formatCurrency(withdrawalData.clearanceFee)} USD</strong>.
                                </p>

                                <p>
                                    This fee is a standard compliance requirement applied to large transactions and is used to facilitate:
                                </p>

                                {/* Bullet Points */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-100 p-1 rounded mt-1">
                                            <Shield className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <strong>Full Anti-Money Laundering (AML) and Know Your Customer (KYC) verifications</strong>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-100 p-1 rounded mt-1">
                                            <Shield className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <strong>International financial regulations compliance</strong>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-100 p-1 rounded mt-1">
                                            <Shield className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <strong>Fraud prevention and advanced security checks</strong>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-100 p-1 rounded mt-1">
                                            <Shield className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <strong>Safe and secure delivery of funds to your nominated account</strong>
                                        </div>
                                    </div>
                                </div>

                                <p>
                                    Please be assured that this process is <strong>100%</strong> secure and fully guaranteed. Once the clearance fee is confirmed, your{" "}
                                    <strong>{formatCurrency(withdrawalData.amount)}</strong> withdrawal will be released immediately and made available in your account within 24 to 48 business hours.
                                </p>

                                <p>
                                    This measure ensures not only the protection of your funds but also full alignment with international financial standards. We understand the importance of trust and transparency, and we guarantee the safe completion of your transaction.
                                </p>

                                <p className="pt-4 border-t border-gray-200">
                                    If you have any questions or require personal assistance, please contact our verified Compliance Support Team.
                                </p>
                            </div>

                            {/* Transaction Details */}
                            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                                <h4 className="font-semibold text-gray-900 mb-3">Transaction Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Reference ID:</span>
                                        <p className="font-mono font-semibold">{withdrawalData.referenceId}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Withdrawal Amount:</span>
                                        <p className="font-semibold">{formatCurrency(withdrawalData.amount)}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Clearance Fee:</span>
                                        <p className="font-semibold text-red-600">{formatCurrency(withdrawalData.clearanceFee)}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Date & Time:</span>
                                        <p className="font-semibold">
                                            {new Date(withdrawalData.timestamp).toLocaleString('en-US', {
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
                                    <span className="font-semibold">SECURE TRANSACTION • SSL ENCRYPTED • FDIC INSURED</span>
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
                                <p className="font-semibold text-gray-900">Pay Clearance Fee</p>
                                <p className="text-gray-600 mt-1">Submit the required clearance fee to proceed</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
                                <p className="font-semibold text-gray-900">Verification</p>
                                <p className="text-gray-600 mt-1">AML/KYC verification process</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
                                <p className="font-semibold text-gray-900">Funds Release</p>
                                <p className="text-gray-600 mt-1">Funds released within 24-48 hours</p>
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
                            onClick={() => navigate('/withdrawal')}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Make Another Withdrawal
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}