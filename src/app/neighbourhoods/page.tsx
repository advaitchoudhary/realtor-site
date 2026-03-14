import Link from "next/link";

export const metadata = { title: "Neighbourhoods" };

const neighbourhoods = [
  { name: "Brampton",     city: "Brampton",  desc: "A diverse city with parks, heritage sites and family-friendly neighbourhoods.",           image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop", listings: 42 },
  { name: "Mississauga",  city: "Mississauga", desc: "Ontario's third-largest city with Lake Ontario waterfront and vibrant urban core.",  image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop", listings: 58 },
  { name: "Milton",       city: "Milton",   desc: "Growing town at the Niagara Escarpment with scenic trails and strong community.",   image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop", listings: 34 },
  { name: "Caledon",      city: "Caledon",  desc: "Rural charm with rolling hills, conservation areas and equestrian estates.",        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop", listings: 27 },
  { name: "Georgetown",   city: "Georgetown", desc: "Historic Halton Hills town with a charming downtown and excellent schools.",      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop", listings: 31 },
  { name: "Bolton",       city: "Bolton",   desc: "Friendly community in Caledon with local shops, parks and easy commuter access.",   image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop", listings: 22 },
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
