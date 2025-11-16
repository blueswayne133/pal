// Help.jsx
"use client"

import { useState, useEffect } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Search } from "lucide-react" 
import api from "../../utils/api"

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Home")

  // Define user + loading states (you forgot these)
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)

  const categories = [
    "Home",
    "Payments and Transfers",
    "Disputes and Limitations",
    "My Account",
    "My Wallet",
    "Login & Security",
    "Seller Tools",
  ]

  const articles = {
    Home: [
      "How do I spot a fake, fraudulent, or phishing PayPal email or website?",
      "How do I open a dispute with a seller?",
      "How do I check the status of my dispute or claim?",
      "How do I escalate a PayPal dispute to a claim?",
      "How do I remove a limitation from my account?",
      "How do I confirm my identity? (CIP)",
    ],
    "Common Questions": [
      "How do I issue a refund?",
      "Why was my payment declined?",
      "How do I link a debit or credit card to my PayPal account?",
      "How do I verify my PayPal account?",
    ],
  }

  // ----------------------------------
  // useEffect → Fetch user profile
  // ----------------------------------
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/user/profile")

      if (response?.data?.data?.user) {
        setUser(response.data.data.user)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">

      <main className="w-full flex-1">
        {/* Header Section */}
        <div className="bg-gray-100 px-4 py-8 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-2 text-sm text-gray-600">Help Center - Personal Account</p>
            <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
              Hi {user.name || "User"}. How can we help?
            </h1>

            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions, keywords, or topics"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 py-3 pl-12 pr-4 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            
            {/* Sidebar */}
            <div className="md:col-span-1">
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full rounded-lg px-4 py-2 text-left transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-100 font-medium text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                For {user.name || "User"}
              </h2>

              <div className="mb-8 space-y-3">
                {articles.Home.map((article, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {article}
                  </a>
                ))}
              </div>

              <h3 className="mb-4 text-2xl font-bold text-gray-900">Common Questions</h3>
              <div className="space-y-3">
                {articles["Common Questions"].map((article, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {article}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
