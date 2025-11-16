// src/pages/admin/AdminDashboard.jsx
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardOverview from "./components/admin/DashboardOverview"
import UserManagement from "./components/admin/UserManagement"
import TransactionManagement from "./components/admin/TransactionManagement"
import EmailManagement from "./components/admin/EmailManagement"
import UserDetail from "./components/admin/UserDetail"
import api from "../../utils/api"
import AdminSidebar from "./components/AdminSidebar"
import AdminHeader from "./components/AdminHeader"
import { getAdminFromLocalStorage } from "../../utils/localStorage"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [selectedUser, setSelectedUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const adminData = getAdminFromLocalStorage()
    if (!adminData) {
      navigate('/admin/login')
      return
    }
    setAdmin(adminData)
    setLoading(false)
  }, [navigate])

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setActiveSection("user-detail")
  }

  const handleBackToList = () => {
    setSelectedUser(null)
    setActiveSection("users")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />
      case "users":
        return <UserManagement onUserSelect={handleUserSelect} />
      case "user-detail":
        return <UserDetail user={selectedUser} onBack={handleBackToList} />
      case "transactions":
        return <TransactionManagement />
      case "email":
        return <EmailManagement />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        selectedUser={selectedUser}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader admin={admin} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}