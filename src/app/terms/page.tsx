import { siteConfig } from "@/lib/config";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions",
  description: "Read the terms and conditions governing your use of our real estate website and services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero */}
      <div className="py-16 text-white relative overflow-hidden" style={{ background: "var(--primary)" }}>
        <div className="absolute inset-0 opacity-5">
          <div className="w-[600px] h-[600px] rounded-full bg-white absolute -right-48 -top-48" />
        </div>
        <div className="max-w-4xl mx-auto px-6 lg:px-10 relative">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>Legal</p>
          <h1 className="text-4xl lg:text-5xl font-bold">Terms &amp; Conditions</h1>
          <p className="text-white/70 mt-4 text-sm">Last updated: March 15, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 prose prose-gray max-w-none">
        <p className="text-gray-600 leading-relaxed">
          Welcome to {siteConfig.site.name}. By accessing and using this website, you agree to be bound by the following terms and conditions. Please read them carefully before using our services.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-600 leading-relaxed">
          By accessing or using {siteConfig.site.name} (the &quot;Website&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use this Website.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">2. Use of Website</h2>
        <p className="text-gray-600 leading-relaxed">
          This Website is provided for informational purposes related to real estate services offered by {siteConfig.agent.name}. You agree to use the Website only for lawful purposes and in a manner that does not infringe upon the rights of, restrict, or inhibit the use and enjoyment of the Website by any third party.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">3. Property Listings</h2>
        <p className="text-gray-600 leading-relaxed">
          Property listings displayed on this Website are provided for general information only. While we strive to ensure accuracy, we do not guarantee that the information regarding listings — including pricing, availability, specifications, and photographs — is complete, current, or error-free. All listing data is subject to change without notice. You should independently verify any information before making real estate decisions.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">4. No Professional Advice</h2>
        <p className="text-gray-600 leading-relaxed">
          The content on this Website does not constitute legal, financial, or professional advice. For specific real estate, legal, or financial matters, you should consult with qualified professionals. Any reliance you place on information from this Website is at your own risk.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">5. Intellectual Property</h2>
        <p className="text-gray-600 leading-relaxed">
          All content on this Website — including text, graphics, logos, images, and software — is the property of {siteConfig.site.name} or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without prior written consent.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">6. User Submissions</h2>
        <p className="text-gray-600 leading-relaxed">
          When you submit inquiries, feedback, or other information through this Website, you grant {siteConfig.site.name} the right to use that information for the purpose of responding to your request and providing real estate services. You represent that any information you provide is accurate and that you have the right to share it.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">7. Third-Party Links</h2>
        <p className="text-gray-600 leading-relaxed">
          This Website may contain links to third-party websites or services that are not owned or controlled by {siteConfig.site.name}. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites. You access third-party sites at your own risk.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">8. Limitation of Liability</h2>
        <p className="text-gray-600 leading-relaxed">
          To the fullest extent permitted by law, {siteConfig.site.name} and {siteConfig.agent.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the Website. This includes, without limitation, damages for loss of profits, data, or other intangible losses.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">9. Modifications</h2>
        <p className="text-gray-600 leading-relaxed">
          We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on this page. Your continued use of the Website after changes are posted constitutes your acceptance of the revised terms.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">10. Governing Law</h2>
        <p className="text-gray-600 leading-relaxed">
          These Terms and Conditions are governed by and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Ontario.
        </p>

        <h2 className="text-2xl font-bold text-[var(--primary)] mt-10 mb-4">11. Contact Us</h2>
        <p className="text-gray-600 leading-relaxed">
          If you have any questions about these Terms and Conditions, please contact us:
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
