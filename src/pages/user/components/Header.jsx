"use client"

import { useState, useEffect } from "react"
import { Menu, X, Bell, Settings } from "lucide-react"
import api from "../../../utils/api"


export default function Header({ activePage, setActivePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const navItems = [
    { id: "home", label: "Home" },
    { id: "send", label: "Send" },
    { id: "activity", label: "Activity" },
    { id: "help", label: "Help" },
  ]

  useEffect(() => {
    fetchPendingTransactionsCount()
  }, [])

  const fetchPendingTransactionsCount = async () => {
    try {
      setLoading(true)
      const response = await api.get('/transactions')
      
      if (response.data.success) {
        const transactions = response.data.data.transactions.data || response.data.data.transactions
        // Count pending transactions (both sent and received)
        const pendingCount = transactions.filter(transaction => 
          transaction.status === 'pending'
        ).length
        setNotificationCount(pendingCount)
      }
    } catch (err) {
      console.error('Error fetching transactions for notification count:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = () => {
    setActivePage("activity")
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    // Clear tokens and redirect to login
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button
            className="md:hidden bg-none border-none text-white cursor-pointer p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* PayPal Logo */}
          <div className="flex items-center font-semibold min-w-10">
            <img src="/logo.png" alt="Logo" className="w-30 h-18" />
          </div>

          <nav className="hidden md:flex gap-8 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`bg-none border-none text-white cursor-pointer px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium hover:bg-blue-800 ${
                  activePage === item.id ? "bg-blue-800" : ""
                }`}
                onClick={() => setActivePage(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <button 
              onClick={handleNotificationClick}
              className="relative bg-none border-none text-white cursor-pointer p-2 flex items-center hover:bg-blue-800 rounded transition-colors"
              title={`${notificationCount} pending transactions`}
            >
              <Bell size={24} />
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* Settings Button */}
            <button
              className="bg-none border-none text-white cursor-pointer p-2 flex items-center hover:bg-blue-800 rounded transition-colors"
              onClick={() => setActivePage("settings")}
            >
              <Settings size={24} />
            </button>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="hidden md:block bg-none border-none text-white cursor-pointer px-4 py-2 text-sm font-medium hover:bg-blue-800 rounded transition-colors"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <nav className="md:hidden bg-blue-900 px-4 py-3 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`bg-none border-none text-white cursor-pointer px-4 py-2 text-left rounded transition-colors text-sm font-medium ${
                activePage === item.id ? "bg-blue-800" : "hover:bg-blue-800"
              }`}
              onClick={() => {
                setActivePage(item.id)
                setMobileMenuOpen(false)
              }}
            >
              {item.label}
            </button>
          ))}
          
          {/* Mobile Logout Button */}
          <button 
            onClick={handleLogout}
            className="bg-none border-none text-white cursor-pointer px-4 py-2 text-left rounded transition-colors text-sm font-medium hover:bg-blue-800 mt-4"
          >
            LOG OUT
          </button>
        </nav>
      )}
    </>
  )
}