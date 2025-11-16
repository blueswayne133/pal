// Send.jsx
"use client"

import { useState } from "react"
import SendTabs from "./components/send/SendTabs"
import SendPayment from "./components/send/SendPayment"
import RequestPayment from "./components/send/RequestPayment"
import ContactsList from "./components/send/ContactsList"

export default function Send() {
  const [activeTab, setActiveTab] = useState("send")

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SendTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1">
        {activeTab === "send" && <SendPayment />}
        {activeTab === "request" && <RequestPayment />}
        {activeTab === "contacts" && <ContactsList />}
      </div>
    </div>
  )
}