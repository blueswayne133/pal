"use client"

export default function SendTabs({ activeTab, setActiveTab }) {
  const tabs = ["send", "request", "contacts"]

  return (
    <div className="border-b border-gray-200">
      <div className="px-6 md:px-12">
        <div className="flex gap-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-4 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
