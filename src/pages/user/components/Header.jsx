"use client"

import { useState } from "react"
import { Menu, X, Bell, Settings } from "lucide-react"

export default function Header({ activePage, setActivePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: "home", label: "Home" },
    { id: "send", label: "Send" },
    { id: "wallet", label: "Wallet" },
    { id: "activity", label: "Activity" },
    { id: "help", label: "Help" },
  ]

  return (
    <>
      <header className="sticky top-0 z-100 bg-blue-900 text-white shadow-lg">
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
            <div className="relative cursor-pointer flex items-center">
              <Bell size={24} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
            </div>
            <button
              className="bg-none border-none text-white cursor-pointer p-2 flex items-center hover:bg-blue-800 rounded transition-colors"
              onClick={() => setActivePage("settings")}
            >
              <Settings size={24} />
            </button>
            <button className="hidden md:block bg-none border-none text-white cursor-pointer px-4 py-2 text-sm font-medium hover:bg-blue-800 rounded transition-colors">
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
        </nav>
      )}
    </>
  )
}
