// StatementsAndTaxes.jsx
import { ChevronLeft } from "lucide-react"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default function StatementsAndTaxes() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-8">
        {/* Back Button */}
        <button className="mb-8 flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700">
          <ChevronLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        {/* Page Title */}
        <h1 className="mb-8 border-b border-gray-200 pb-6 text-3xl font-bold text-gray-900">
          Download detailed statements
        </h1>

        {/* Custom Option */}
        <div className="mb-8 rounded-lg border-2 border-gray-200 bg-white p-6">
          <div className="-m-4 flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Custom</h3>
              <p className="text-sm text-gray-600">
                Just get the info you need. Choose the transaction type, date range, and more.
              </p>
            </div>
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-12 text-center text-gray-600">
          Looking for a running balance in your statement? Choose the Custom option.
        </p>
      </main>

      <Footer />
    </div>
  )
}