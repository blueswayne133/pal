"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, Menu, X } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const closeDropdown = () => setIsDropdownOpen(false)

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button
              onClick={() => {
                navigate("/")
                setIsOpen(false)
                setIsDropdownOpen(false)
              }}
              className="flex items-center cursor-pointer hover:opacity-80 transition"
            >
                  <img src="/logo.png" alt="Logo" className="w-30 h-18" />
              {/* <span className="ml-2 text-xl font-bold text-blue-900">PayPal</span> */}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 font-bold text-gray-800 hover:text-blue-600 transition relative ${
                  isDropdownOpen ? "text-gray-800" : ""
                }`}
              >
                PERSONAL
                <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                {/* Blue underline when dropdown is open */}
                {isDropdownOpen && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
              </button>
              
              <button 
                onClick={() => navigate("/business")}
                className="px-4 py-2 font-bold text-gray-800 hover:text-blue-600 transition"
              >
                BUSINESS
              </button>
              
              <button 
                onClick={() => navigate("/security")}
                className="px-4 py-2 font-bold text-gray-800 hover:text-blue-600 transition"
              >
                SECURITY
              </button>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-full font-semibold hover:bg-blue-50 transition"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isDropdownOpen && (
        <div className="hidden md:block bg-blue-900 text-white border-b-4 border-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-start">
              {/* Menu Items Grid */}
              <div className="grid grid-cols-2 gap-8 flex-1">
                {/* Row 1 */}
                <div className="cursor-pointer hover:opacity-80 transition">
                  <h3 className="font-bold text-white mb-1">How PayPal Works</h3>
                  <p className="text-sm text-gray-300">What you can do with a personal account</p>
                </div>
                <div className="cursor-pointer hover:opacity-80 transition">
                  <h3 className="font-bold text-white mb-1">Send Payments</h3>
                  <p className="text-sm text-gray-300">Send payments abroad</p>
                </div>
                {/* Row 2 */}
                <div className="cursor-pointer hover:opacity-80 transition">
                  <h3 className="font-bold text-white mb-1">Pay Online</h3>
                  <p className="text-sm text-gray-300">Online payments without borders</p>
                </div>
                <div className="cursor-pointer hover:opacity-80 transition">
                  <h3 className="font-bold text-white mb-1">Search for Deals</h3>
                  <p className="text-sm text-gray-300">Pay with PayPal and save money</p>
                </div>
              </div>

              {/* Close Button */}
              <button onClick={closeDropdown} className="ml-8 text-white hover:opacity-70 transition flex-shrink-0">
                <X size={28} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 pb-4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full text-left px-4 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-between"
          >
            PERSONAL
            <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Mobile Dropdown */}
          {isDropdownOpen && (
            <div className="bg-blue-900 text-white px-4 py-4 space-y-4">
              <div className="cursor-pointer hover:opacity-80">
                <h3 className="font-bold text-white mb-1">How PayPal Works</h3>
                <p className="text-sm text-gray-300">What you can do with a personal account</p>
              </div>
              <div className="cursor-pointer hover:opacity-80">
                <h3 className="font-bold text-white mb-1">Send Payments</h3>
                <p className="text-sm text-gray-300">Send payments abroad</p>
              </div>
              <div className="cursor-pointer hover:opacity-80">
                <h3 className="font-bold text-white mb-1">Pay Online</h3>
                <p className="text-sm text-gray-300">Online payments without borders</p>
              </div>
              <div className="cursor-pointer hover:opacity-80">
                <h3 className="font-bold text-white mb-1">Search for Deals</h3>
                <p className="text-sm text-gray-300">Pay with PayPal and save money</p>
              </div>
            </div>
          )}

          <button 
            onClick={() => {
              navigate("/business")
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            BUSINESS
          </button>
          
          <button 
            onClick={() => {
              navigate("/security")
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            SECURITY
          </button>

          <div className="flex flex-col gap-2 px-4 pt-4">
            <button
              onClick={() => {
                navigate("/login")
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-full font-semibold hover:bg-blue-50 transition"
            >
              Log In
            </button>
            <button
              onClick={() => {
                navigate("/signup")
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  )
}