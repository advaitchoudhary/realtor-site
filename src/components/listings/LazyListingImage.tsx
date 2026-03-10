"use client";

import { useEffect, useRef, useState } from "react";
import { Home } from "lucide-react";

interface Props {
  id: string;
  address: string;
  className?: string;
}

export default function LazyListingImage({ id, address, className = "" }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fetchedRef.current) {
          fetchedRef.current = true;
          observer.disconnect();

          fetch(`/api/listings/${id}/image`)
            .then((r) => r.json())
            .then((d: { image: string | null }) => {
              if (d.image) setSrc(d.image);
              else setError(true);
            })
            .catch(() => setError(true));
        }
      },
      { rootMargin: "300px" } // start loading 300px before card enters view
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  return (
    <div ref={containerRef} className={`w-full h-full relative bg-gray-100 ${className}`}>
      {/* Shimmer skeleton shown while loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 skeleton" />
      )}

      {/* Fallback icon shown if no image */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-2">
          <Home size={40} strokeWidth={1} />
          <span className="text-xs text-gray-400">No photo</span>
        </div>
      )}

      {/* Real image — fades in once loaded */}
      {src && (
        <img
          src={src}
          alt={address}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => { setLoaded(false); setError(true); setSrc(null); }}
          loading="lazy"
        />
      )}
    </div>
  );
}
