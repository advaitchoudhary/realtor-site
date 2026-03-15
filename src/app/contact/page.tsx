import ContactForm from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/config";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata = { title: "Contact" };

const contactInfo = [
  { icon: Phone, label: "Phone", value: siteConfig.agent.phone, href: `tel:${siteConfig.agent.phone}` },
  { icon: Mail, label: "Email", value: siteConfig.agent.email, href: `mailto:${siteConfig.agent.email}` },
  { icon: MapPin, label: "Office", value: siteConfig.agent.license, href: undefined },
  { icon: Clock, label: "Hours", value: "Mon–Fri: 9am–7pm · Sat–Sun: 10am–5pm", href: undefined },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Header */}
      <div className="py-16 text-white text-center" style={{ background: "var(--primary)" }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
          Get in touch
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-white/70 max-w-xl mx-auto">
          Have a question about buying, selling or renting? We&apos;re here to help.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid lg:grid-cols-5 gap-10">
        {/* Contact info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">Let&apos;s Talk</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Whether you&apos;re ready to make a move or just exploring your options, I&apos;d love to connect.
              Fill out the form or reach out directly.
            </p>
          </div>

          {contactInfo.map((item) =>
            item.href ? (
              <a
                key={item.label}
                href={item.href}
                className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--primary)" }}>
                  <item.icon size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</div>
                  <div className="font-medium text-gray-800 group-hover:text-[var(--primary)] transition-colors">{item.value}</div>
                </div>
              </a>
            ) : (
              <div key={item.label} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--secondary)" }}>
                  <item.icon size={18} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</div>
                  <div className="font-medium text-gray-800">{item.value}</div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Form */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[var(--primary)] mb-2">Send a Message</h3>
          <p className="text-sm text-gray-500 mb-6">We typically respond within 2 hours during business hours.</p>
          <ContactForm type="general" source="contact" />
        </div>
      </div>
    </div>
  );
}
