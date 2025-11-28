// AdminHeader.jsx
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, User, Bell, Menu } from "lucide-react"

import { removeAdminFromLocalStorage } from "../../../utils/localStorage"
import api from "../../../utils/api"

export default function AdminHeader({ admin }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/admin/auth/logout')
    } catch (error) {
      console.error('Admin logout error:', error)
    } finally {
      removeAdminFromLocalStorage()
      navigate('/admin/login')
    }
  }

  const getRoleBadge = (role) => {
    const roleStyles = {
      super_admin: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm",
      admin: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm",
      support: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
    }
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${roleStyles[role] || 'bg-gray-500 text-white'}`}>
        {role.replace('_', ' ').toUpperCase()}
      </span>
    )
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200/60 backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          {/* Notifications */}
          <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
            <Bell size={22} className="group-hover:scale-110 transition-transform" />
            <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
              3
            </span>
          </button>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                <User size={18} className="text-white" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-800">{admin?.name}</p>
                {getRoleBadge(admin?.role)}
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-200/60 py-2 z-50 backdrop-blur-sm bg-white/95">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{admin?.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{admin?.email}</p>
                  <div className="mt-2">
                    {getRoleBadge(admin?.role)}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors group"
                >
                  <LogOut size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}