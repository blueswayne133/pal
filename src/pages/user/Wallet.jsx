import LinkNewCard from "./components/wallet/LinkNewCard"
import WalletCards from "./components/wallet/WalletCards"

export default function Wallet() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <LinkNewCard />
      <WalletCards />
    </div>
  )
}