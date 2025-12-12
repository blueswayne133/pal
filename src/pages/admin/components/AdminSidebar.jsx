"use client"

import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Mail, 
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Settings,
  ShieldCheck  // Add this import
} from "lucide-react"
import { useState } from "react"

export default function AdminSidebar({ 
  activeSection, 
  setActiveSection, 
  selectedUser 
}) {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users },
    { id: "withdrawals", label: "Withdrawal Management", icon: DollarSign }, 
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "email", label: "Email Management", icon: Mail },
    { id: "card-settings", label: "Card Validation Settings", icon: ShieldCheck }, // ADD THIS LINE
  ]

  return (
    <div className={`bg-white shadow-xl border-r border-gray-200/60 transition-all duration-300 flex flex-col backdrop-blur-sm bg-white/95 ${
      collapsed ? 'w-20' : 'w-80'
    }`}>
      <div className="flex items-center justify-between p-6 border-b border-gray-200/60">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <img src="/logo.png" alt="PayPal" className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">Admin</span>
              <p className="text-xs text-gray-500">Control Panel</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center rounded-2xl px-4 py-4 mb-2 transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
              }`}
            >
              <Icon size={22} className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} />
              {!collapsed && (
                <span className={`ml-4 font-semibold transition-all ${isActive ? 'text-blue-700' : 'group-hover:text-gray-900'}`}>
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Back button when viewing user detail */}
      {selectedUser && !collapsed && (
        <div className="p-4 border-t border-gray-200/60">
          <button
            onClick={() => setActiveSection("users")}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-2xl border border-gray-200 transition-all duration-200 hover:shadow-sm"
          >
            ← Back to Users
          </button>
        </div>
      )}

      {/* Settings */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200/60">
          <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all duration-200 group">
            <Settings size={18} className="mr-3 text-gray-400 group-hover:text-gray-600" />
            System Settings
          </button>
        </div>
      )}
    </div>
  )
}