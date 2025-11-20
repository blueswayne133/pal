// UserDashboard.jsx
"use client"

import { useState } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Dashboard from "./Dashboard"
import Send from "./Send"
import Withdrawal from "./Withdrawal"
import Wallet from "./Wallet"
import Activity from "./Activity"
import Help from "./Help"
import Settings from "./Settings"
import StatementsAndTaxes from "./StatementsAndTaxes"

export default function UserDashboard() {
    const [activePage, setActivePage] = useState("home")

    const renderPage = () => {
        switch (activePage) {
            case "home":
                return <Dashboard />
            case "send":
                return <Send />
            case "withdrawal":
                return <Withdrawal />
            case "wallet":
                return <Wallet />
            case "activity":
                return <Activity />
            case "help":
                return <Help />
            case "settings":
                return <Settings />
            case "statements":
                return <StatementsAndTaxes />
            default:
                return <Dashboard />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 w-full">{renderPage()}</main>
            <Footer />
        </div>
    )
}