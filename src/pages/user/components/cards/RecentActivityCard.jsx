// RecentActivityCard.jsx
export default function RecentActivityCard({ user }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-bold text-gray-900 text-xl mb-4">Recent activity</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {user?.transactions_count > 0 
          ? `You have ${user.transactions_count} recent transactions.`
          : "See when money comes in, and when it goes out. You'll find your recent PayPal activity here."
        }
      </p>
      <a href="#show-all" className="text-blue-600 hover:text-blue-700 font-medium">
        Show all
      </a>
    </div>
  )
}