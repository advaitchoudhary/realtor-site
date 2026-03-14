"use client";

import { useRouter } from "next/navigation";

const cities = [
  { name: "Brampton",     image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop", listings: "520+" },
  { name: "Mississauga",  image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop", listings: "680+"  },
  { name: "Milton",       image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop", listings: "340+"  },
  { name: "Caledon",      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop", listings: "270+"  },
  { name: "Georgetown",   image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop", listings: "310+"  },
  { name: "Bolton",       image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop", listings: "220+"  },
];

export default function CitySearch() {
  const router = useRouter();

  return (
    <section className="py-20" style={{ background: "var(--secondary)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
            Explore by city
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--primary)]">
            Browse Your Area
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Explore thousands of listings in Ontario&apos;s most desirable cities and neighbourhoods.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {cities.map((city) => (
            <button
              key={city.name}
              onClick={() => router.push(`/listings?city=${encodeURIComponent(city.name)}&type=Sale`)}
              className="relative group rounded-2xl overflow-hidden aspect-[3/2] cursor-pointer"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-left">
                <div className="font-bold text-lg">{city.name}</div>
                <div className="text-sm text-white/80">{city.listings} listings</div>
              </div>
              <div
                className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ background: "var(--accent)" }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
