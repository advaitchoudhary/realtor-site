import { Suspense } from "react";
import ListingsClient from "./ListingsClient";

export const metadata = { title: "Listings" };

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-32 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-[#C9A84C] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading listings…</p>
        </div>
      </div>
    }>
      <ListingsClient />
    </Suspense>
  );
}
