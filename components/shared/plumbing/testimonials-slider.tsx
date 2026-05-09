"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type Testimonial = {
  name: string;
  location: string;
  image: string;
  review: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Ama Owusu",
    location: "East Legon",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=140&q=80",
    review: "Excellent service. Leak fixed within 30 minutes. Professional and affordable."
  },
  {
    name: "Kofi Mensah",
    location: "Tema",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=140&q=80",
    review: "Booked at 9 AM and the plumber arrived before noon. Great communication and clean finish."
  },
  {
    name: "Nana Agyemang",
    location: "Airport Residential",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=140&q=80",
    review: "Transparent pricing and honest advice. They repaired our water heater the same day."
  }
];

export function TestimonialsSlider() {
  const [index, setIndex] = useState(0);
  const current = useMemo(() => testimonials[index], [index]);

  const previous = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Google-style reviews</p>
        <div className="flex items-center gap-2">
          <button
            onClick={previous}
            className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-sky-100"
            aria-label="Show previous testimonial"
            data-analytics="testimonial_previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-sky-100"
            aria-label="Show next testimonial"
            data-analytics="testimonial_next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-3">
          <img src={current.image} alt={current.name} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
          <div>
            <p className="font-semibold text-slate-900">{current.name}</p>
            <p className="text-sm text-slate-500">{current.location}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1 text-amber-400" aria-label="5 star rating">
          {Array.from({ length: 5 }).map((_, star) => (
            <Star key={star} className="h-4 w-4 fill-current" />
          ))}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-700">{current.review}</p>
      </div>
    </div>
  );
}
