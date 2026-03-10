import Link from "next/link";

export const metadata = { title: "Neighbourhoods" };

const neighbourhoods = [
  { name: "The Annex",          city: "Toronto",     desc: "Tree-lined streets, Victorian homes, close to University of Toronto.", image: "https://picsum.photos/id/1029/600/400", listings: 42 },
  { name: "Rosedale",           city: "Toronto",     desc: "Toronto's most prestigious neighbourhood with grand historic estates.", image: "https://picsum.photos/id/164/600/400",  listings: 28 },
  { name: "Leslieville",        city: "Toronto",     desc: "Trendy east-end community with cafés, boutiques and parks.",           image: "https://picsum.photos/id/106/600/400",  listings: 35 },
  { name: "Bloor West Village", city: "Toronto",     desc: "Family-friendly, top schools, charming retail strip.",                 image: "https://picsum.photos/id/137/600/400",  listings: 51 },
  { name: "Port Credit",        city: "Mississauga", desc: "Lakeside village with stunning waterfront and dining.",                image: "https://picsum.photos/id/65/600/400",   listings: 24 },
  { name: "Old Oakville",       city: "Oakville",    desc: "Heritage homes, harbour views and upscale amenities.",                image: "https://picsum.photos/id/42/600/400",   listings: 19 },
];

export default function NeighbourhoodsPage() {
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="py-16 text-white text-center" style={{ background: "var(--primary)" }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Explore</p>
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Neighbourhoods</h1>
        <p className="text-white/70 max-w-xl mx-auto">Discover the unique character of Ontario&apos;s best communities.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {neighbourhoods.map((n) => (
          <Link key={n.name} href={`/listings?city=${encodeURIComponent(n.city)}&type=Sale`} className="group block">
            <div className="listing-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="relative overflow-hidden aspect-video">
                <img src={n.image} alt={n.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="font-bold text-lg">{n.name}</div>
                  <div className="text-sm text-white/80">{n.city}</div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{n.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--primary)]">{n.listings} listings</span>
                  <span className="text-xs text-[var(--accent)] font-medium group-hover:underline">View listings →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
