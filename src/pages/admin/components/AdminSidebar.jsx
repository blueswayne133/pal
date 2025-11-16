"use client"

import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Mail, 
  ChevronLeft,
  ChevronRight,
  Settings
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
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "email", label: "Email Management", icon: Mail },
  ]

  return (
    <div className={`bg-white shadow-sm border-r border-gray-200 transition-all duration-300 flex flex-col ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <img src="/logo.png" alt="PayPal" className="h-8 w-auto" />
            <span className="ml-2 text-lg font-semibold text-gray-900">Admin</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center rounded-lg px-3 py-3 mb-1 transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Back button when viewing user detail */}
      {selectedUser && !collapsed && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setActiveSection("users")}
            className="w-full flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
          >
            ← Back to Users
          </button>
        </div>
      )}

      {/* Settings */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            <Settings size={16} className="mr-2" />
            Settings
          </button>
        </div>
      )}
    </div>
  )
}