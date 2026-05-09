import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  Building2,
  CheckCircle2,
  Clock3,
  Droplets,
  Flame,
  Hammer,
  LifeBuoy,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Star,
  Wrench
} from "lucide-react";
import { BookingForm } from "@/components/shared/plumbing/booking-form";
import { TestimonialsSlider } from "@/components/shared/plumbing/testimonials-slider";

const companyName = "BluePipe Plumbing Ghana";
const phone = "+233201234567";
const formattedPhone = "+233 20 123 4567";
const whatsappLink = "https://wa.me/233201234567?text=Hello%20BluePipe%2C%20I%20need%20a%20plumber";

export const metadata: Metadata = {
  title: "Premium Plumbing Services in Ghana | 24/7 Emergency Plumber",
  description:
    "Trusted plumbing services in Accra and surrounding areas. Fast emergency response, transparent pricing, and licensed technicians for homes and businesses.",
  keywords: ["plumber near me", "emergency plumber", "plumbing services", "pipe repair", "drain cleaning"],
  openGraph: {
    title: "BluePipe Plumbing Ghana | Fast & Reliable Plumbing Services",
    description: "Book trusted, licensed plumbers for emergency repairs, leak detection, and installations.",
    type: "website",
    locale: "en_GH"
  },
  alternates: {
    canonical: "/plumbing"
  }
};

const services = [
  {
    title: "Emergency Plumbing",
    description: "Rapid response for burst pipes, severe leaks, and urgent plumbing failures.",
    icon: LifeBuoy
  },
  { title: "Leak Detection", description: "Accurate leak tracing to protect your walls, floors, and water bills.", icon: Droplets },
  { title: "Drain Cleaning", description: "Powerful unclogging for blocked drains and slow-flow systems.", icon: Wrench },
  { title: "Pipe Installation", description: "Modern, durable pipework for renovations and new builds.", icon: Hammer },
  { title: "Bathroom Plumbing", description: "Toilet, sink, and shower installations with neat professional finish.", icon: Building2 },
  { title: "Water Heater Repair", description: "Reliable diagnostics and repairs for electric and gas heaters.", icon: Flame },
  { title: "Sewer Line Repair", description: "Safe sewer inspections, maintenance, and line restoration.", icon: ShieldCheck },
  { title: "Commercial Plumbing", description: "Business-focused plumbing support with minimal downtime.", icon: BadgeCheck }
];

const trustPoints = [
  "Fast response times across Accra and nearby areas",
  "Certified and experienced plumbing specialists",
  "Upfront pricing with no hidden charges",
  "Professional-grade tools and quality materials",
  "Friendly technicians who keep your space clean",
  "Warranty-backed repairs and installations"
];

const areas = ["Accra", "East Legon", "Tema", "Spintex", "Airport Residential", "Labone"];

const faqs = [
  {
    question: "How much does plumbing repair cost?",
    answer: "Pricing depends on the issue and parts needed. We provide upfront quotes before work starts."
  },
  {
    question: "Do you offer emergency services?",
    answer: "Yes. Our emergency plumbing team is available 24/7 for urgent residential and commercial issues."
  },
  {
    question: "How quickly can a plumber arrive?",
    answer: "For most Accra locations, we target same-day service and urgent calls within 60 to 120 minutes."
  },
  {
    question: "Do you offer warranties?",
    answer: "Yes. Most repairs and installations include a workmanship warranty for your peace of mind."
  },
  {
    question: "Which areas do you serve?",
    answer: "We serve Accra, East Legon, Tema, Spintex, Airport Residential, Labone, and nearby communities."
  }
];

const blogs = [
  {
    title: "How to Detect Hidden Pipe Leaks Before They Cause Damage",
    excerpt: "Learn practical warning signs and quick checks that help you catch hidden leaks early.",
    image:
      "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Common Causes of Blocked Drains and How to Prevent Them",
    excerpt: "From grease buildup to root intrusion, discover what blocks drains and what to do next.",
    image:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Signs Your Water Heater Needs Immediate Repair",
    excerpt: "No hot water, strange sounds, or rusty water? These symptoms mean your system needs attention.",
    image:
      "https://images.unsplash.com/photo-1621905252472-943afaa20e56?auto=format&fit=crop&w=800&q=80"
  }
];

export default function PlumbingLandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    name: companyName,
    image: "https://images.unsplash.com/photo-1621905252472-943afaa20e56?auto=format&fit=crop&w=1200&q=80",
    telephone: formattedPhone,
    priceRange: "$$",
    areaServed: areas,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressCountry: "GH"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "142"
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59"
      }
    ],
    sameAs: ["https://www.facebook.com", "https://www.instagram.com"]
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-slate-950 px-4 py-2 text-center text-xs font-semibold text-white">
        24/7 Emergency Plumbing Service Available. Call now for immediate assistance - {formattedPhone}
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4" aria-label="Main navigation">
          <Link href="/plumbing" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-900">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white">
              <Wrench className="h-5 w-5" />
            </span>
            BluePipe
          </Link>
          <ul className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            {["Home", "Services", "About", "Reviews", "Contact"].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="transition hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${phone}`}
              className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 sm:inline-flex"
            >
              Call Now
            </a>
            <a
              href="#booking"
              className="inline-flex rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
            >
              Book Service
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="relative isolate overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1800&q=80"
            alt="Professional plumber fixing a kitchen sink"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/75 to-slate-900/45" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-28">
            <div>
              <p className="inline-flex rounded-full border border-sky-300/40 bg-sky-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-100">
                Trusted plumbing partner in Ghana
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                Fast Reliable Plumbing Services You Can Trust
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
                Licensed plumbers for repairs, installations, and emergency services. Available 24 hours for homes,
                landlords, property managers, and small businesses.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#booking"
                  className="inline-flex items-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-200"
                  data-analytics="hero_book_plumber"
                >
                  Book a Plumber <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  data-analytics="hero_call_now"
                >
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Call Now
                </a>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-white/95 sm:grid-cols-4">
                {["Licensed Technicians", "Same-Day Service", "Transparent Pricing", "Satisfaction Guarantee"].map((item) => (
                  <p key={item} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 text-sky-300" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/95 p-4 shadow-2xl shadow-slate-900/20 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["10+ Years", "Experience"],
                  ["5,000+", "Repairs Completed"],
                  ["24/7", "Emergency Support"],
                  ["98%", "Customer Satisfaction"]
                ].map(([stat, label]) => (
                  <div key={stat} className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-2xl font-extrabold text-slate-900">{stat}</p>
                    <p className="mt-1 text-sm text-slate-600">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Live emergency line</p>
                <p className="mt-1">Plumber dispatch available in under 10 minutes for urgent requests.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Our services</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Complete plumbing solutions for every property type
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
                <a href="#booking" className="mt-4 inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
                  Learn more <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="bg-slate-950 py-16 text-white sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">Why choose us</p>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Premium quality, reliable outcomes, zero surprises</h2>
              <div className="mt-6 space-y-3">
                {trustPoints.map((point) => (
                  <p key={point} className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-100">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                    {point}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <h3 className="text-xl font-bold">How it works</h3>
              <div className="mt-5 space-y-4">
                {[
                  "Request a service online or call our support line.",
                  "A professional plumber arrives at your location quickly.",
                  "We fix the problem safely and professionally."
                ].map((step, idx) => (
                  <div key={step} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-100">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6 shadow-lg sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-red-700">Emergency plumbing</p>
                <h2 className="mt-1 text-3xl font-extrabold text-slate-900">Plumbing Emergency</h2>
                <p className="mt-2 text-sm text-slate-700">
                  Burst pipe or blocked drain? Our emergency team responds fast to reduce damage.
                </p>
              </div>
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
                data-analytics="emergency_call"
              >
                Call Emergency Line
              </a>
            </div>
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Social proof</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Loved by homeowners and businesses</h2>
              <p className="mt-4 text-slate-600">
                Trusted by families, landlords, and business owners for fast turnaround and excellent workmanship.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm">
                <span className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </span>
                4.9/5 from 140+ verified reviews
              </div>
            </div>
            <TestimonialsSlider />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="grid gap-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Service areas</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Local experts near you</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                {areas.map((area) => (
                  <p key={area} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-slate-700">
                    <MapPin className="h-4 w-4 text-sky-700" />
                    {area}
                  </p>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <iframe
                title="Map of service areas in Accra"
                src="https://www.google.com/maps?q=Accra%2C%20Ghana&z=11&output=embed"
                className="h-[320px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <section id="booking" className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">Book now</p>
              <h2 className="mt-2 text-3xl font-extrabold">Need a trusted plumber today?</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-200">
                We handle urgent repairs, installations, and inspections with premium professionalism and transparent
                pricing.
              </p>
              <div className="mt-6 space-y-3 text-sm">
                {[
                  "Average response time under 2 hours",
                  "Fully licensed, insured, and background-checked team",
                  "Clear estimates before work begins"
                ].map((item) => (
                  <p key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sky-300" />
                    {item}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Call Now
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  aria-label="Chat on WhatsApp"
                >
                  WhatsApp Chat
                </a>
              </div>
            </div>
            <BookingForm />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "10+ years experience", icon: Clock3 },
              { label: "5,000+ projects completed", icon: Wrench },
              { label: "24/7 emergency support", icon: PhoneCall },
              { label: "98% customer satisfaction", icon: ShieldCheck }
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <Icon className="mx-auto h-6 w-6 text-sky-700" />
                <p className="mt-3 text-sm font-semibold text-slate-800">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">FAQ</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">{faq.question}</summary>
                <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Latest insights</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Plumbing tips and maintenance guides</h2>
            </div>
            <a href="#" className="hidden text-sm font-semibold text-sky-700 sm:inline-flex">
              View all posts
            </a>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {blogs.map((blog) => (
              <article key={blog.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src={blog.image} alt={blog.title} className="h-44 w-full object-cover" loading="lazy" />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{blog.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{blog.excerpt}</p>
                  <a href="#" className="mt-3 inline-flex items-center text-sm font-semibold text-sky-700">
                    Read more <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 pb-16 sm:pb-20">
          <div className="rounded-3xl bg-sky-600 p-8 text-white shadow-xl shadow-sky-200 sm:p-10">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Need a Plumber Today?</h2>
            <p className="mt-3 max-w-2xl text-sm text-sky-50 sm:text-base">
              Speak with our support team now and get fast, professional plumbing assistance at your location.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                Call Now
              </a>
              <a
                href="#booking"
                className="inline-flex items-center rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Book Service Online
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-white">{companyName}</p>
            <p className="mt-2 text-sm text-slate-400">
              Premium plumbing services for homes and businesses in Ghana with emergency support.
            </p>
            <p className="mt-4 text-sm">
              Working hours: <span className="font-semibold text-white">24/7 Support</span>
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Contact</p>
            <div className="mt-3 space-y-2 text-sm text-slate-400">
              <p>{formattedPhone}</p>
              <p>support@bluepipegh.com</p>
              <p>Accra, Ghana</p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white">Services</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              {services.slice(0, 5).map((service) => (
                <li key={service.title}>{service.title}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Google Business Profile</li>
              <li>Facebook</li>
              <li>Instagram</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </footer>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
        aria-label="Open WhatsApp chat"
        data-analytics="floating_whatsapp_chat"
      >
        <MessageSquareIcon />
        WhatsApp
      </a>
    </div>
  );
}

function MessageSquareIcon() {
  return <BookOpenText className="h-4 w-4" aria-hidden="true" />;
}
