import { Suspense } from "react";
import MapClient from "./MapClient";

export const metadata = { title: "Map Search" };

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center text-gray-400">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-[#C9A84C] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading map…</p>
        </div>
      </div>
    }>
      <MapClient />
    </Suspense>
  );
}
