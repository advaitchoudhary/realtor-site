"use client";

import { useEffect, useState } from "react";
import { Inquiry } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import {
  MessageSquare, Phone, Mail, Home, Clock, CheckCircle, XCircle,
  Filter, Search, ChevronDown, Trash2, MoreVertical, TrendingUp, Users, Eye,
  Lock, Loader2, LogOut, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_COLORS = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  closed: "bg-green-100 text-green-700",
};

const TYPE_LABELS: Record<string, string> = {
  general: "General",
  listing: "Listing",
  valuation: "Valuation",
  buyer: "Buyer",
};

const SOURCE_LABELS: Record<string, string> = {
  contact: "Contact Page",
  listing: "Listing Page",
  "home-value": "Home Value Estimator",
  mortgage: "Mortgage Calculator",
  affordability: "Affordability Calculator",
  "land-transfer-tax": "Land Transfer Tax",
  other: "Other",
};

const SOURCE_COLORS: Record<string, string> = {
  contact: "bg-purple-100 text-purple-700",
  listing: "bg-indigo-100 text-indigo-700",
  "home-value": "bg-emerald-100 text-emerald-700",
  mortgage: "bg-orange-100 text-orange-700",
  affordability: "bg-cyan-100 text-cyan-700",
  "land-transfer-tax": "bg-rose-100 text-rose-700",
  other: "bg-gray-100 text-gray-600",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");

  // Check if already authenticated on mount
  useEffect(() => {
    fetch("/api/auth")
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
          fetchInquiries();
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecking(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      if (!res.ok) {
        const data = await res.json();
        setLoginError(data.error || "Invalid credentials");
        return;
      }
      setAuthenticated(true);
      fetchInquiries();
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" }).catch(() => {});
    setAuthenticated(false);
    setLoginForm({ username: "", password: "" });
  }

  async function fetchInquiries() {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      // Add demo data if empty
      if (!data.length) {
        setInquiries(getDemoInquiries());
      } else {
        setInquiries(data);
      }
    } catch {
      setInquiries(getDemoInquiries());
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const updated = inquiries.map((i) => i.id === id ? { ...i, status: status as Inquiry["status"] } : i);
    setInquiries(updated);
    if (selected?.id === id) setSelected({ ...selected, status: status as Inquiry["status"] });
    await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  }

  async function saveNotes(id: string) {
    const updated = inquiries.map((i) => i.id === id ? { ...i, notes } : i);
    setInquiries(updated);
    if (selected?.id === id) setSelected({ ...selected!, notes });
    await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    }).catch(() => {});
  }

  async function deleteInquiry(id: string) {
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    if (selected?.id === id) setSelected(null);
    await fetch(`/api/inquiries/${id}`, { method: "DELETE" }).catch(() => {});
  }

  const filtered = inquiries.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (typeFilter !== "all" && i.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.message.toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    contacted: inquiries.filter((i) => i.status === "contacted").length,
    closed: inquiries.filter((i) => i.status === "closed").length,
  };

  // Show a loading spinner while checking auth
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <Loader2 size={32} className="animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  // Login modal
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Blurred background hint */}
        <div className="bg-white border-b border-gray-100 shadow-sm opacity-30 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5">
            <h1 className="text-2xl font-bold text-[var(--primary)]">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage client inquiries</p>
          </div>
        </div>

        {/* Modal overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Modal header */}
            <div className="px-8 pt-8 pb-4 text-center">
              <div
                className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5"
                style={{ background: "var(--primary)" }}
              >
                <ShieldCheck size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--primary)]">Admin Login</h2>
              <p className="text-sm text-gray-500 mt-2">
                Enter your credentials to access the dashboard
              </p>
            </div>

            {/* Login form */}
            <form onSubmit={handleLogin} className="px-8 pb-8 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="admin@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                  <XCircle size={16} className="text-red-500 shrink-0" />
                  <p className="text-sm text-red-600">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "var(--primary)" }}
              >
                {loginLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--primary)]">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage client inquiries</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              {stats.new} new
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Inquiries", value: stats.total, icon: MessageSquare, color: "var(--primary)" },
            { label: "New / Unread", value: stats.new, icon: Eye, color: "#3b82f6" },
            { label: "In Progress", value: stats.contacted, icon: TrendingUp, color: "#f59e0b" },
            { label: "Closed", value: stats.closed, icon: CheckCircle, color: "#22c55e" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: s.color + "18" }}>
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6 h-[calc(100vh-300px)]">
          {/* Inquiry list */}
          <div className="w-full lg:w-80 xl:w-96 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-gray-100 space-y-3">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inquiries…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 text-xs border border-gray-200 rounded-xl px-2 py-1.5 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="flex-1 text-xs border border-gray-200 rounded-xl px-2 py-1.5 outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="general">General</option>
                  <option value="listing">Listing</option>
                  <option value="buyer">Buyer</option>
                  <option value="valuation">Valuation</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="skeleton h-16 rounded-xl" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No inquiries found</div>
              ) : (
                filtered.map((inq) => (
                  <button
                    key={inq.id}
                    onClick={() => { setSelected(inq); setNotes(inq.notes ?? ""); }}
                    className={cn(
                      "w-full p-4 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors",
                      selected?.id === inq.id && "bg-[var(--secondary)]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {inq.status === "new" && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                        <div className="font-medium text-sm text-gray-900 truncate">{inq.name}</div>
                      </div>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full shrink-0 font-medium", STATUS_COLORS[inq.status])}>
                        {inq.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">{inq.message}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-[var(--primary)] font-medium">{TYPE_LABELS[inq.type] ?? inq.type}</span>
                        {inq.source && (
                          <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", SOURCE_COLORS[inq.source] ?? "bg-gray-100 text-gray-600")}>
                            {SOURCE_LABELS[inq.source] ?? inq.source}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{timeAgo(inq.createdAt)}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Detail panel */}
          {selected ? (
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-[var(--primary)]">{selected.name}</h2>
                    <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", STATUS_COLORS[selected.status])}>
                      {selected.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{timeAgo(selected.createdAt)} · {TYPE_LABELS[selected.type] ?? selected.type} inquiry</span>
                    {selected.source && (
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold", SOURCE_COLORS[selected.source] ?? "bg-gray-100 text-gray-600")}>
                        via {SOURCE_LABELS[selected.source] ?? selected.source}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => deleteInquiry(selected.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Contact info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Mail size={11} /> Email
                    </div>
                    <a href={`mailto:${selected.email}`} className="text-sm font-medium text-[var(--primary)] hover:underline break-all">
                      {selected.email}
                    </a>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Phone size={11} /> Phone
                    </div>
                    <a href={`tel:${selected.phone}`} className="text-sm font-medium text-[var(--primary)] hover:underline">
                      {selected.phone || "—"}
                    </a>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Clock size={11} /> Received
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {new Date(selected.createdAt).toLocaleDateString("en-CA", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>

                {/* Listing info */}
                {selected.listingAddress && (
                  <div className="p-4 rounded-xl border border-gray-200">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Home size={11} /> Listing
                    </div>
                    <div className="font-semibold text-gray-900">{selected.listingAddress}</div>
                    {selected.listingPrice && (
                      <div className="text-sm text-gray-500 mt-0.5">{formatPrice(selected.listingPrice)}</div>
                    )}
                  </div>
                )}

                {/* Message */}
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MessageSquare size={11} /> Message
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {selected.message}
                  </div>
                </div>

                {/* Status update */}
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Update Status</div>
                  <div className="flex gap-2">
                    {(["new", "contacted", "closed"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all",
                          selected.status === s
                            ? "text-white border-transparent"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        )}
                        style={selected.status === s ? { background: "var(--primary)" } : {}}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Internal Notes</div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add private notes about this client…"
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 ring-[var(--primary)] focus:border-transparent resize-none"
                  />
                  <button
                    onClick={() => saveNotes(selected.id)}
                    className="mt-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ background: "var(--primary)" }}
                  >
                    Save Notes
                  </button>
                </div>
              </div>

              {/* Quick actions */}
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all hover:bg-[var(--secondary)]"
                  style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                >
                  <Mail size={15} /> Reply by Email
                </a>
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ background: "var(--primary)" }}
                  >
                    <Phone size={15} /> Call Now
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 text-sm">
              <div className="text-center">
                <MessageSquare size={40} className="mx-auto mb-3 opacity-20" />
                Select an inquiry to view details
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getDemoInquiries(): Inquiry[] {
  return [
    { id: "demo-1", name: "Sarah Thompson", email: "sarah.t@email.com", phone: "(416) 555-0142", message: "Hi, I'm very interested in the 3-bedroom detached home I saw on your website. Could we schedule a viewing this weekend?", listingAddress: "107 King St, Toronto, ON", listingPrice: 1125000, type: "listing", source: "listing", status: "new", createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: "demo-2", name: "Michael Chen", email: "mchen@gmail.com", phone: "(905) 555-0198", message: "Looking to buy in Mississauga, budget around $800K-1M. Need 4 beds minimum, good schools nearby.", type: "buyer", source: "contact", status: "contacted", createdAt: new Date(Date.now() - 86400000).toISOString(), notes: "Very motivated buyer, pre-approved at $950K." },
    { id: "demo-3", name: "Priya & Raj Mehta", email: "mehta.family@email.com", phone: "(647) 555-0213", message: "Home Valuation Request:\nAddress: 22 Maple Drive, Oakville\nType: detached | Beds: 4 | Baths: 3\nApprox. 2400 sq ft\nBuilt: 2008\nCondition: good", type: "valuation", source: "home-value", status: "new", createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: "demo-4", name: "David Kowalski", email: "david.k@outlook.com", phone: "", message: "Just a general inquiry — what neighbourhoods do you specialize in?", type: "general", source: "contact", status: "closed", createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), notes: "Referred to Bloor West listings." },
    { id: "demo-5", name: "Linda Hoffmann", email: "lhoffmann@yahoo.com", phone: "(416) 555-0077", message: "Interested in the condo listing on Bay St. What are the maintenance fees and is parking included?", listingAddress: "821 Bay St, Toronto, ON", listingPrice: 649000, type: "listing", source: "listing", status: "new", createdAt: new Date(Date.now() - 1800000).toISOString() },
  ];
}
