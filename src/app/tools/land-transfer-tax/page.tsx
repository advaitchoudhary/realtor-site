"use client";

import { useState, useMemo } from "react";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import { Landmark, Phone, Info } from "lucide-react";

function calcOntarioLTT(price: number): number {
  if (price <= 0) return 0;
  let tax = 0;
  const brackets = [
    { limit: 55000, rate: 0.005 },
    { limit: 250000, rate: 0.01 },
    { limit: 400000, rate: 0.015 },
    { limit: 2000000, rate: 0.02 },
    { limit: Infinity, rate: 0.025 },
  ];
  let prev = 0;
  for (const b of brackets) {
    if (price <= prev) break;
    const taxable = Math.min(price, b.limit) - prev;
    tax += taxable * b.rate;
    prev = b.limit;
  }
  return tax;
}

function calcTorontoLTT(price: number): number {
  if (price <= 0) return 0;
  let tax = 0;
  const brackets = [
    { limit: 55000, rate: 0.005 },
    { limit: 250000, rate: 0.01 },
    { limit: 400000, rate: 0.015 },
    { limit: 2000000, rate: 0.02 },
    { limit: Infinity, rate: 0.025 },
  ];
  let prev = 0;
  for (const b of brackets) {
    if (price <= prev) break;
    const taxable = Math.min(price, b.limit) - prev;
    tax += taxable * b.rate;
    prev = b.limit;
  }
  return tax;
}

export default function LandTransferTaxPage() {
  const [price, setPrice] = useState(600000);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [inToronto, setInToronto] = useState(false);

  const result = useMemo(() => {
    const ontario = calcOntarioLTT(price);
    const toronto = inToronto ? calcTorontoLTT(price) : 0;
    const ontarioRebate = isFirstTime ? Math.min(ontario, 4000) : 0;
    const torontoRebate = isFirstTime && inToronto ? Math.min(toronto, 4475) : 0;
    const total = ontario + toronto - ontarioRebate - torontoRebate;
    return { ontario, toronto, ontarioRebate, torontoRebate, total };
  }, [price, isFirstTime, inToronto]);

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
            <Landmark className="shrink-0" size={40} />
            Land Transfer Tax Calculator
          </h1>
          <p className="text-white/70 mt-4 max-w-xl">
            Calculate Ontario and Toronto municipal land transfer taxes, including first-time buyer rebates.
          </p>
        </div>
      </div>

      {/* Calculator */}
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
              {/* Purchase Price */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Purchase Price</label>
                <input
                  type="range"
                  min={100000}
                  max={3000000}
                  step={10000}
                  value={price}
                  onChange={(e) => setPrice(+e.target.value)}
                  className="w-full accent-[var(--accent)]"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">$100K</span>
                  <span className="text-lg font-bold text-[var(--primary)]">{fmt(price)}</span>
                  <span className="text-xs text-gray-400">$3M</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFirstTime}
                    onChange={(e) => setIsFirstTime(e.target.checked)}
                    className="w-5 h-5 rounded accent-[var(--accent)]"
                  />
                  <span className="text-sm font-medium text-gray-700">I&apos;m a first-time home buyer</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inToronto}
                    onChange={(e) => setInToronto(e.target.checked)}
                    className="w-5 h-5 rounded accent-[var(--accent)]"
                  />
                  <span className="text-sm font-medium text-gray-700">Property is in the City of Toronto</span>
                </label>
              </div>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 rounded-2xl p-5 flex gap-3">
              <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 leading-relaxed">
                <p className="font-semibold mb-1">About Land Transfer Tax</p>
                <p>
                  Ontario charges a provincial land transfer tax on all property purchases. The City of Toronto levies an additional municipal tax. First-time buyers may qualify for rebates of up to $4,000 (Ontario) and $4,475 (Toronto).
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Total Land Transfer Tax</p>
              <p className="text-4xl font-bold" style={{ color: "var(--primary)" }}>
                {fmt(result.total)}
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Ontario LTT</span>
                  <span className="text-sm font-semibold text-gray-800">{fmt(result.ontario)}</span>
                </div>
                {inToronto && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Toronto Municipal LTT</span>
                    <span className="text-sm font-semibold text-gray-800">{fmt(result.toronto)}</span>
                  </div>
                )}
                {isFirstTime && (
                  <>
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                      <span className="text-sm text-gray-500">Ontario Rebate</span>
                      <span className="text-sm font-semibold text-green-600">-{fmt(result.ontarioRebate)}</span>
                    </div>
                    {inToronto && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-50">
                        <span className="text-sm text-gray-500">Toronto Rebate</span>
                        <span className="text-sm font-semibold text-green-600">-{fmt(result.torontoRebate)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-6 text-white" style={{ background: "var(--primary)" }}>
              <p className="font-semibold mb-2">Have questions about closing costs?</p>
              <p className="text-sm text-white/70 mb-4">
                {siteConfig.agent.name} can walk you through all the costs involved in purchasing your home.
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
