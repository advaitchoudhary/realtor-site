"use client";
import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sakshi Pahwa",
    location: "GTA, ON",
    text: "Buying a home is one of the biggest decisions in life, and we couldn't have asked for a better guide than Manoj Chaudhary! From start to finish, Manoj worked tirelessly to help us secure a great deal on our new home, negotiating the price below the asking value at a prime location. His expertise, persistence, and dedication made the entire process seamless and stress-free. Manoj truly cares about his clients and ensures their best interests are prioritized. His professionalism, market knowledge, and strong negotiation skills truly set him apart. If you're looking for a realtor who genuinely puts your needs first and delivers exceptional results, Manoj is the one to call. We're so grateful for his hard work and couldn't be happier with our new home!",
    rating: 5,
    avatar: "https://picsum.photos/id/1005/100/100",
  },
  {
    name: "Ankita Gupta",
    location: "GTA, ON",
    text: "We have tons of realtors in town but Manoj ji is a true gem amongst them. We couldn't have asked for a better realtor for our home. He has helped us buy and even sell property amidst even the difficult market situations. He has not just been a realtor but a true guide, friend and saviour. He has a meticulous approach towards every deal and is super approachable. We could always count on him during our buying and selling tenure. He made sure we get the best deal out in the market and he truly achieved it. Thanks to Manoj ji for his all time support and guidance in this real estate market.",
    rating: 5,
    avatar: "https://picsum.photos/id/1012/100/100",
  },
  {
    name: "Chaitali Tailor",
    location: "GTA, ON",
    text: "We are so grateful to Mr. Manoj for helping us find our new home. He was patient, knowledgeable, and guided us through every step with care. His support made the whole process smooth and stress-free. Thank you so much.",
    rating: 5,
    avatar: "https://picsum.photos/id/1027/100/100",
  },
  {
    name: "Soumya Ahuja",
    location: "GTA, ON",
    text: "Working with Manoj was an incredible experience. He's highly professional, responsive and genuinely invested his time in helping us find the right fit. I'm now settled in my new home, and couldn't thank him enough to help us find this property. I would absolutely recommend him to anyone looking for a dedicated and outstanding agent!",
    rating: 5,
    avatar: "https://picsum.photos/id/1011/100/100",
  },
];

const REVIEWS_LINK = "https://www.google.com/search?q=Manoj+Chaudhary+Realtor.ca+Reviews";

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
          <a
            href={REVIEWS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-[var(--primary)] hover:underline font-medium"
          >
            View more reviews on Realtor.ca & Google →
          </a>
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
