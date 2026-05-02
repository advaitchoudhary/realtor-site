import { siteConfig } from "@/lib/config";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how we collect, use, and protect your personal information when you use our real estate website and services.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero */}
      <div className="py-16 text-white relative overflow-hidden" style={{ background: "var(--primary)" }}>
        <div className="absolute inset-0 opacity-5">
          <div className="w-[600px] h-[600px] rounded-full bg-white absolute -right-48 -top-48" />
        </div>
        <div className="max-w-4xl mx-auto px-6 lg:px-10 relative">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>Legal</p>
          <h1 className="text-4xl lg:text-5xl font-bold">Privacy Policy</h1>
          <p className="text-white/70 mt-4 text-sm">Last updated: March 15, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 prose prose-gray max-w-none">
        <p className="text-gray-600 leading-relaxed">
          At {siteConfig.site.name}, operated by {siteConfig.agent.name}, your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our Website.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">1. Information We Collect</h2>
        <p className="text-gray-600 leading-relaxed">
          We may collect the following types of information:
        </p>
        <p className="text-gray-600 leading-relaxed">
          <strong>Personal Information:</strong> When you submit an inquiry or contact form, we collect your name, email address, phone number, and any message content you provide. This information is collected only when you voluntarily provide it to us.
        </p>
        <p className="text-gray-600 leading-relaxed">
          <strong>Usage Data:</strong> We may automatically collect information about your device, browser type, IP address, pages visited, time spent on pages, and other diagnostic data when you access the Website.
        </p>
        <p className="text-gray-600 leading-relaxed">
          <strong>Cookies:</strong> We may use cookies and similar tracking technologies to enhance your browsing experience and analyze Website usage. You can control cookie settings through your browser preferences.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">2. How We Use Your Information</h2>
        <p className="text-gray-600 leading-relaxed">
          We use the information we collect for the following purposes: to respond to your inquiries and provide real estate services; to send you property listings and market updates you have requested; to improve and maintain our Website; to analyze usage trends and optimize user experience; and to comply with legal obligations.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">3. How We Share Your Information</h2>
        <p className="text-gray-600 leading-relaxed">
          We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our Website and conducting business, provided they agree to keep your information confidential. We may also disclose your information when required by law or to protect the rights and safety of {siteConfig.site.name}, our users, or others.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">4. Data Security</h2>
        <p className="text-gray-600 leading-relaxed">
          We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">5. Data Retention</h2>
        <p className="text-gray-600 leading-relaxed">
          We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Inquiry data is retained for a reasonable period to allow us to follow up and provide requested services, after which it is securely deleted.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">6. Your Rights</h2>
        <p className="text-gray-600 leading-relaxed">
          Depending on your jurisdiction, you may have the right to access, correct, or delete the personal information we hold about you. You may also have the right to withdraw consent for data processing or request data portability. To exercise any of these rights, please contact us using the information provided below.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">7. Third-Party Services</h2>
        <p className="text-gray-600 leading-relaxed">
          Our Website may contain links to third-party websites and services, including property listing platforms and mapping services. These third parties have their own privacy policies, and we are not responsible for their practices. We encourage you to review their privacy policies before providing any personal information.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">8. Children&apos;s Privacy</h2>
        <p className="text-gray-600 leading-relaxed">
          Our Website is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately so we can take steps to remove it.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">9. Changes to This Policy</h2>
        <p className="text-gray-600 leading-relaxed">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised &quot;Last updated&quot; date. We encourage you to review this policy periodically to stay informed about how we are protecting your information.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">10. Contact Us</h2>
        <p className="text-gray-600 leading-relaxed">
          If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
        </p>
        <div className="mt-4 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="font-semibold text-[var(--primary)]">{siteConfig.agent.name}</p>
          <p className="text-sm text-gray-500 mt-1">{siteConfig.agent.address}</p>
          <p className="text-sm text-gray-500 mt-1">
            Phone: <a href={`tel:${siteConfig.agent.phone}`} className="hover:text-[var(--primary)] transition-colors">{siteConfig.agent.phone}</a>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Email: <a href={`mailto:${siteConfig.agent.email}`} className="hover:text-[var(--primary)] transition-colors">{siteConfig.agent.email}</a>
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <Link href="/" className="inline-block px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--primary)" }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
