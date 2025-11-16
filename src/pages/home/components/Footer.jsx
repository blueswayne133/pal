export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="px-4 py-12 max-w-7xl mx-auto">
        {/* PayPal Logo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">PayPal</h2>
        </div>

        {/* Footer Links Grid - Mobile Stack, Desktop Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div className="space-y-3">
            <a href="#" className="block text-sm hover:underline">
              Help
            </a>
            <a href="#" className="block text-sm hover:underline">
              Security
            </a>
            <a href="#" className="block text-sm hover:underline">
              Business Resource Centre
            </a>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <a href="#" className="block text-sm hover:underline">
              Contact
            </a>
            <a href="#" className="block text-sm hover:underline">
              Apps
            </a>
            <a href="#" className="block text-sm hover:underline">
              Money Hub
            </a>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <a href="#" className="block text-sm hover:underline">
              Fees
            </a>
            <a href="#" className="block text-sm hover:underline">
              Shop
            </a>
          </div>

          {/* Column 4 */}
          <div className="space-y-3">
            <a href="#" className="block text-sm hover:underline">
              PSR Quotation Tool
            </a>
            <a href="#" className="block text-sm hover:underline">
              Enterprise
            </a>
          </div>
        </div>

        {/* Modern Slavery & Language */}
        <div className="mb-6 pb-6 border-b border-gray-700">
          <a href="#" className="block text-sm hover:underline mb-4">
            Modern Slavery Statement
          </a>
          <button className="flex items-center gap-2 text-sm hover:underline">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 40'%3E%3Crect fill='%23012169' width='60' height='40'/%3E%3Cpath fill='%23FFF' d='M0 0v40h60V0z' stroke='%23FFF' strokeWidth='1'/%3E%3C/svg%3E"
              alt="UK"
              className="w-5 h-3"
            />
            English (UK)
          </button>
        </div>

        {/* Additional Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-700">
          <a href="#" className="text-sm hover:underline">
            About
          </a>
          <a href="#" className="text-sm hover:underline">
            Newsroom
          </a>
          <a href="#" className="text-sm hover:underline">
            Jobs
          </a>
          <a href="#" className="text-sm hover:underline">
            Developers
          </a>
          <a href="#" className="text-sm hover:underline">
            Partners
          </a>
        </div>

        {/* Copyright & Legal Links */}
        <div className="space-y-4 mb-6 text-xs">
          <p className="text-gray-400">© 1999–2025</p>

          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:underline">
              Accessibility
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Cookies
            </a>
            <a href="#" className="hover:underline">
              Legal
            </a>
            <a href="#" className="hover:underline">
              Complaints
            </a>
          </div>
        </div>

        {/* Legal Disclaimer Text */}
        <div className="text-xs text-gray-400 space-y-3 border-t border-gray-700 pt-6">
          <p>
            PayPal UK Ltd is authorised and regulated by the Financial Conduct Authority (FCA) as an electronic money
            institution (firm reference number 994790); in relation to its regulated consumer credit activities (firm
            reference number 996405); and for the provision of cryptocurrency services (firm reference number 1000741).
            Some products and services, such as PayPal Pay in 3 and PayPal Working Capital, are not regulated by the FCA
            and may offer a lower level of protection. Please read product terms for further details. PayPal UK Ltd's
            company number is 14741686. Its registered office is 5 Fleet Place, London, United Kingdom, EC4M 7RD.
          </p>
          <p>All screen images are for illustrative purposes only.</p>
          <p>
            <sup>1</sup> Rewards are earned as points under the PayPal+ rewards programme. To start earning, you must be
            enrolled in PayPal+. If you are not yet enrolled, you can sign up in the PayPal app. PayPal+{" "}
            <a href="#" className="underline">
              Terms and conditions
            </a>{" "}
            apply. See our{" "}
            <a href="#" className="underline">
              FAQs
            </a>{" "}
            for details.
          </p>
          <p>
            <sup>2</sup> An account is required to send and receive money. Fees apply when converting currency and
            sending money other than GBP to an account in another country. See{" "}
            <a href="#" className="underline">
              fees
            </a>
            .
          </p>
          <p>
            <sup>3</sup> An account with PayPal is required to create a Pool. Fees apply when converting currency and
            sending money to an account in another country.{" "}
            <a href="#" className="underline">
              Terms and limitations
            </a>{" "}
            apply.
          </p>
        </div>
      </div>
    </footer>
  )
}
