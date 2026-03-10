"use client";
import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah & Michael T.",
    location: "Toronto, ON",
    text: "John found us our dream home in under 3 weeks! His knowledge of the Toronto market is second to none, and he negotiated $40K off the asking price. Couldn't be happier.",
    rating: 5,
    avatar: "https://picsum.photos/id/1005/100/100",
  },
  {
    name: "David K.",
    location: "Mississauga, ON",
    text: "Sold my condo in just 5 days at above asking! John staged it beautifully and his marketing strategy brought in multiple offers. Truly a professional who delivers results.",
    rating: 5,
    avatar: "https://picsum.photos/id/1012/100/100",
  },
  {
    name: "Priya & Raj M.",
    location: "Oakville, ON",
    text: "As first-time buyers, we were nervous, but John walked us through every step with patience and expertise. He was always available and genuinely cared about finding the right home.",
    rating: 5,
    avatar: "https://picsum.photos/id/1027/100/100",
  },
  {
    name: "Linda H.",
    location: "Brampton, ON",
    text: "John helped me downsize after 25 years in my family home. His empathy and professionalism made an emotional process much easier. Sold above asking in a slow market!",
    rating: 5,
    avatar: "https://picsum.photos/id/1011/100/100",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="py-20" style={{ background: "var(--secondary)" }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
            What clients say
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--primary)]">
            Client Testimonials
          </h2>
        </div>

        <div className="relative">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <Quote size={48} className="mb-6 opacity-10" style={{ color: "var(--primary)" }} />
            <p className="text-gray-700 text-lg leading-relaxed mb-8 min-h-[80px]">
              &ldquo;{testimonials[current].text}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <img
                src={testimonials[current].avatar}
                alt={testimonials[current].name}
                className="w-14 h-14 rounded-full object-cover border-2"
                style={{ borderColor: "var(--accent)" }}
              />
              <div>
                <div className="font-bold text-[var(--primary)]">{testimonials[current].name}</div>
                <div className="text-sm text-gray-500">{testimonials[current].location}</div>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} size={13} fill="var(--accent)" stroke="none" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2.5 h-2.5 rounded-full transition-all"
                style={{ background: i === current ? "var(--primary)" : "#d1d5db" }}
              />
            ))}
            <button
              onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
