"use client";

import { useState, useMemo } from "react";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import { Calculator, DollarSign, Percent, Clock, TrendingUp, Phone } from "lucide-react";

export default function MortgageCalculatorPage() {
  const [homePrice, setHomePrice] = useState(600000);
  const [downPayment, setDownPayment] = useState(120000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [amortization, setAmortization] = useState(25);

  const result = useMemo(() => {
    const principal = homePrice - downPayment;
    if (principal <= 0) return { monthly: 0, totalPaid: 0, totalInterest: 0, principal: 0 };
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = amortization * 12;
    const monthly =
      monthlyRate === 0
        ? principal / numPayments
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPaid = monthly * numPayments;
    const totalInterest = totalPaid - principal;
    return { monthly, totalPaid, totalInterest, principal };
  }, [homePrice, downPayment, interestRate, amortization]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);

  const dpPercent = homePrice > 0 ? ((downPayment / homePrice) * 100).toFixed(1) : "0";
  const needsCmhc = homePrice > 0 && downPayment / homePrice < 0.2;

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero */}
      <div className="py-16 text-white relative overflow-hidden" style={{ background: "var(--primary)" }}>
        <div className="absolute inset-0 opacity-5">
          <div className="w-[600px] h-[600px] rounded-full bg-white absolute -right-48 -top-48" />
        </div>
        <div className="max-w-5xl mx-auto px-6 lg:px-10 relative">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            Tools
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold flex items-center gap-4">
            <Calculator className="shrink-0" size={40} />
            Mortgage Calculator
          </h1>
          <p className="text-white/70 mt-4 max-w-xl">
            Estimate your monthly mortgage payments and see a full breakdown of principal, interest, and total cost.
          </p>
        </div>
      </div>

      {/* Calculator */}
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
              {/* Home Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign size={16} style={{ color: "var(--accent)" }} />
                  Home Price
                </label>
                <input
                  type="range"
                  min={100000}
                  max={3000000}
                  step={10000}
                  value={homePrice}
                  onChange={(e) => setHomePrice(+e.target.value)}
                  className="w-full accent-[var(--accent)]"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">$100K</span>
                  <span className="text-lg font-bold text-[var(--primary)]">{fmt(homePrice)}</span>
                  <span className="text-xs text-gray-400">$3M</span>
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <TrendingUp size={16} style={{ color: "var(--accent)" }} />
                  Down Payment ({dpPercent}%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={homePrice}
                  step={5000}
                  value={downPayment}
                  onChange={(e) => setDownPayment(+e.target.value)}
                  className="w-full accent-[var(--accent)]"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">$0</span>
                  <span className="text-lg font-bold text-[var(--primary)]">{fmt(downPayment)}</span>
                  <span className="text-xs text-gray-400">{fmt(homePrice)}</span>
                </div>
                {needsCmhc && (
                  <p className="text-xs text-amber-600 mt-2 bg-amber-50 rounded-lg px-3 py-2">
                    Down payment is below 20% — CMHC mortgage insurance will be required.
                  </p>
                )}
              </div>

              {/* Interest Rate */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Percent size={16} style={{ color: "var(--accent)" }} />
                  Interest Rate
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={12}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(+e.target.value)}
                  className="w-full accent-[var(--accent)]"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">0.5%</span>
                  <span className="text-lg font-bold text-[var(--primary)]">{interestRate.toFixed(1)}%</span>
                  <span className="text-xs text-gray-400">12%</span>
                </div>
              </div>

              {/* Amortization */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock size={16} style={{ color: "var(--accent)" }} />
                  Amortization Period
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[10, 15, 20, 25, 30].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setAmortization(yr)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        amortization === yr
                          ? "text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      style={amortization === yr ? { background: "var(--primary)" } : {}}
                    >
                      {yr} yrs
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Monthly Payment</p>
              <p className="text-4xl font-bold" style={{ color: "var(--primary)" }}>
                {fmt(result.monthly)}
              </p>
              <p className="text-xs text-gray-400 mt-1">per month</p>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Mortgage Amount</span>
                  <span className="text-sm font-semibold text-gray-800">{fmt(result.principal)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Total Interest</span>
                  <span className="text-sm font-semibold text-red-500">{fmt(result.totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-gray-500">Total Cost</span>
                  <span className="text-sm font-bold text-gray-800">{fmt(result.totalPaid)}</span>
                </div>
              </div>

              {/* Visual bar */}
              <div className="mt-6">
                <div className="h-3 rounded-full overflow-hidden bg-gray-100 flex">
                  <div
                    className="h-full rounded-l-full"
                    style={{
                      width: `${result.totalPaid > 0 ? (result.principal / result.totalPaid) * 100 : 50}%`,
                      background: "var(--primary)",
                    }}
                  />
                  <div
                    className="h-full rounded-r-full bg-red-400"
                    style={{
                      width: `${result.totalPaid > 0 ? (result.totalInterest / result.totalPaid) * 100 : 50}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "var(--primary)" }} />
                    Principal
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                    Interest
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-6 text-white" style={{ background: "var(--primary)" }}>
              <p className="font-semibold mb-2">Need pre-approval?</p>
              <p className="text-sm text-white/70 mb-4">
                Contact {siteConfig.agent.name} for expert mortgage guidance and lender referrals.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "var(--accent)" }}
              >
                <Phone size={14} /> Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
