const stats = [
  { value: "500+", label: "Homes Sold" },
  { value: "12+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "$2.4B+", label: "Total Sales Volume" },
];

export default function StatsBar() {
  return (
    <section className="bg-[var(--primary)] text-white py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl lg:text-4xl font-bold mb-1" style={{ color: "var(--accent)" }}>
              {s.value}
            </div>
            <div className="text-sm text-white/70 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
