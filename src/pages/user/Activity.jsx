// Activity.jsx
"use client"

import { useState } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Search, Download, Sliders } from "lucide-react"

export default function Activity() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
    

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-2 border-gray-200 py-3 pl-12 pr-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border-2 border-gray-200 p-3 transition-colors hover:bg-gray-100">
              <Sliders className="h-5 w-5 text-gray-600" />
            </button>
            <button className="rounded-lg border-2 border-gray-200 p-3 transition-colors hover:bg-gray-100">
              <Download className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mb-8">
          <button className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-200">
            Date: Last 90 days
          </button>
        </div>

        {/* Empty State */}
        <div className="py-20 text-center">
          <p className="mb-2 text-2xl font-bold text-gray-900">No transactions yet.</p>
          <p className="text-gray-600">Want to try again with different dates?</p>
        </div>
      </main>

      <Footer />
    </div>
  )
}