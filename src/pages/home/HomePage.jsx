import Footer from "./components/Footer"
import HeroSection from "./components/HeroSection"
import BuyersSection from "./components/BuyersSection"
import FeaturesSection from "./components/FeaturesSection"
import EveryoneSection from "./components/EveryoneSection"
import Header from "./components/Header"
import StatsSection from "./components/StatsSection"
import NewsSection from "./components/NewsSection"
import GlobalStatsSection from "./components/GlobalStatsSection"
import PaymentSolutions from "./components/PaymentSolutions"
import CryptoSection from "./components/CryptoSection"
import MobileAppSection from "./components/MobileAppSection"
import IntegrationSection from "./components/IntegrationSection"

export default function HomePage() {
  return (
    <div className="w-full">
      <Header />
      <HeroSection />
      <GlobalStatsSection />
      <BuyersSection />
      <PaymentSolutions />
      <FeaturesSection />
      <CryptoSection />
      <MobileAppSection />
      <IntegrationSection />
      <StatsSection />
      <EveryoneSection />
      <NewsSection />
      <Footer />
    </div>
  )
}