// Dashboard.jsx
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../utils/api"
import { getUserFromLocalStorage } from "../../utils/localStorage"
import BalanceCard from "./components/cards/BalanceCard"
import CardsSection from "./components/cards/CardsSection"
import MobilePhoneCard from "./components/cards/MobilePhoneCard"
import RecentActivityCard from "./components/cards/RecentActivityCard"

export default function Dashboard() {
  const [userData, setUserData] = useState(null)
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Get user data from localStorage first for immediate display
      const localUser = getUserFromLocalStorage()
      if (localUser) {
        setUserData(localUser)
      }

      // Fetch dashboard data from API
      const response = await api.get('/user/dashboard')
      
      if (response.data.success) {
        setUserData(response.data.data.user)
        setDashboardStats(response.data.data.stats)
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err)
      const errorData = err.response?.data
      setError(errorData?.message || 'Failed to load dashboard data')
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUserUpdate = () => {
    fetchDashboardData() // Refresh user data
  }

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <MobilePhoneCard user={userData} onUpdate={handleUserUpdate} />
        <BalanceCard user={userData} stats={dashboardStats} />
        <RecentActivityCard user={userData} />
      </div>
      <div className="md:col-span-1">
        <CardsSection user={userData} stats={dashboardStats} />
      </div>
    </div>
  )
}