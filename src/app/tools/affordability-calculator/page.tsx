"use client";

import { useState, useMemo } from "react";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import { Wallet, Phone, CheckCircle, AlertTriangle } from "lucide-react";

export default function AffordabilityCalculatorPage() {
  const [annualIncome, setAnnualIncome] = useState(100000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(100000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [amortization] = useState(25);
  const [propertyTax, setPropertyTax] = useState(300);
  const [heatingCost] = useState(150);

  const result = useMemo(() => {
    const monthlyIncome = annualIncome / 12;

    // GDS: housing costs should be <= 39% of gross monthly income
    const gdsLimit = monthlyIncome * 0.39;
    // TDS: housing costs + debts should be <= 44% of gross monthly income
    const tdsLimit = monthlyIncome * 0.44 - monthlyDebts;

    const maxMonthlyPayment = Math.min(gdsLimit, tdsLimit) - propertyTax - heatingCost;
    if (maxMonthlyPayment <= 0) return { maxHome: 0, maxMortgage: 0, maxMonthly: 0, gdsRatio: 0, tdsRatio: 0 };

    // Reverse mortgage calc
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = amortization * 12;
    const maxMortgage =
      monthlyRate === 0
        ? maxMonthlyPayment * numPayments
        : (maxMonthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1)) /
          (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

    const maxHome = maxMortgage + downPayment;

    // Actual ratios at max price
    const housingCosts = maxMonthlyPayment + propertyTax + heatingCost;
    const gdsRatio = (housingCosts / monthlyIncome) * 100;
    const tdsRatio = ((housingCosts + monthlyDebts) / monthlyIncome) * 100;

    return { maxHome, maxMortgage, maxMonthly: maxMonthlyPayment, gdsRatio, tdsRatio };
  }, [annualIncome, monthlyDebts, downPayment, interestRate, amortization, propertyTax, heatingCost]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);

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
            <Wallet className="shrink-0" size={40} />
            Affordability Calculator
          </h1>
          <p className="text-white/70 mt-4 max-w-xl">
            Find out how much home you can afford based on your income, debts, and down payment using Canadian lending guidelines (GDS/TDS ratios).
          </p>
        </div>
      </div>

      {/* Calculator */}
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
              {/* Annual Income */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Gross Annual Household Income
                </label>
                <input
                  type="range"
                  min={30000}
                  max={500000}
                  step={5000}
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(+e.target.value)}
                  className="w-full accent-[var(--accent)]"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">$30K</span>
                  <span className="text-lg font-bold text-[var(--primary)]">{fmt(annualIncome)}</span>
                  <span className="text-xs text-gray-400">$500K</span>
                </div>
              </div>

              {/* Monthly Debts */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Monthly Debt Payments (car, student loans, credit cards)
                </label>
                <input
                  type="range"
                  min={0}
                  max={5000}
                  step={50}
                  value={monthlyDebts}
                  onChange={(e) => setMonthlyDebts(+e.target.value)}
                  className="w-full accent-[var(--accent)]"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">$0</span>
                  <span className="text-lg font-bold text-[var(--primary)]">{fmt(monthlyDebts)}/mo</span>
                  <span className="text-xs text-gray-400">$5K</span>
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Down Payment Saved</label>
                <input
                  type="range"
                  min={0}
                  max={1000000}
                  step={5000}
                  value={downPayment}
                  onChange={(e) => setDownPayment(+e.target.value)}
                  className="w-full accent-[var(--accent)]"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">$0</span>
                  <span className="text-lg font-bold text-[var(--primary)]">{fmt(downPayment)}</span>
                  <span className="text-xs text-gray-400">$1M</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Interest Rate</label>
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

              {/* Property Tax */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Est. Monthly Property Tax</label>
                <input
                  type="range"
                  min={100}
                  max={1500}
                  step={25}
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(+e.target.value)}
                  className="w-full accent-[var(--accent)]"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">$100</span>
                  <span className="text-lg font-bold text-[var(--primary)]">{fmt(propertyTax)}/mo</span>
                  <span className="text-xs text-gray-400">$1,500</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">You Can Afford Up To</p>
              <p className="text-4xl font-bold" style={{ color: "var(--primary)" }}>
                {result.maxHome > 0 ? fmt(result.maxHome) : "$0"}
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Max Mortgage</span>
                  <span className="text-sm font-semibold text-gray-800">{fmt(result.maxMortgage)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Down Payment</span>
                  <span className="text-sm font-semibold text-gray-800">{fmt(downPayment)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Max Monthly Payment</span>
                  <span className="text-sm font-semibold text-gray-800">{fmt(result.maxMonthly)}</span>
                </div>
              </div>

              {/* Ratios */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2">
                  {result.gdsRatio <= 39 ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    GDS Ratio: <strong>{result.gdsRatio.toFixed(1)}%</strong> <span className="text-gray-400">(max 39%)</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {result.tdsRatio <= 44 ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    TDS Ratio: <strong>{result.tdsRatio.toFixed(1)}%</strong> <span className="text-gray-400">(max 44%)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-6 text-white" style={{ background: "var(--primary)" }}>
              <p className="font-semibold mb-2">Ready to start your search?</p>
              <p className="text-sm text-white/70 mb-4">
                Let {siteConfig.agent.name} help you find the perfect home within your budget.
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
