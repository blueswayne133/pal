"use client"

import { useState, useEffect } from "react"
import AccountSettings from "./components/settings/AccountSettings"
import SecuritySettings from "./components/settings/SecuritySettings"
import DataPrivacySettings from "./components/settings/DataPrivacySettings"
import PaymentsSettings from "./components/settings/PaymentsSettings"
import NotificationsSettings from "./components/settings/NotificationsSettings"
import SellerToolsSettings from "./components/settings/SellerToolsSettings"
import api from "../../utils/api"


export default function Settings() {
  const [activeTab, setActiveTab] = useState("Account")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  // -------------------------
  // GET USER PROFILE
  // -------------------------
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

  // -------------------------
  // UPDATE USER PROFILE
  // -------------------------
  const updateUserProfile = async (updatedData) => {
    try {
      const response = await api.put("/user/profile", updatedData)

      if (response.data?.data?.user) {
        setUser(response.data.data.user)
        return { success: true, data: response.data.data.user }
      }

    } catch (error) {
      console.error("Error updating profile:", error)

      return {
        success: false,
        errors: error.response?.data?.errors || { general: "Failed to update profile" }
      }
    }
  }

  const tabs = ["Account", "Security", "Data & Privacy", "Payments", "Notifications", "Seller Tools"]

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    switch (activeTab) {
      case "Account":
        return <AccountSettings user={user} onUpdateProfile={updateUserProfile} />
      case "Security":
        return <SecuritySettings user={user} />
      case "Data & Privacy":
        return <DataPrivacySettings user={user} />
      case "Payments":
        return <PaymentsSettings user={user} />
      case "Notifications":
        return <NotificationsSettings user={user} />
      case "Seller Tools":
        return <SellerToolsSettings user={user} />
      default:
        return <AccountSettings user={user} onUpdateProfile={updateUserProfile} />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">

      <main className="w-full flex-1">
        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="-mb-px flex gap-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap border-b-2 px-2 py-4 font-medium transition-colors ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          {renderContent()}
        </div>
      </main>

    </div>
  )
}
