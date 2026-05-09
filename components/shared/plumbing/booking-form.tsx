"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const bookingSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number.")
    .regex(/^[0-9+\s()-]+$/, "Phone number contains invalid characters."),
  location: z.string().min(2, "Please enter your location."),
  service: z.string().min(2, "Please select a service."),
  preferredTime: z.string().min(2, "Please select a preferred time.")
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const serviceOptions = [
  "Emergency Plumbing",
  "Leak Detection",
  "Drain Cleaning",
  "Pipe Installation",
  "Bathroom Plumbing",
  "Water Heater Repair",
  "Sewer Line Repair",
  "Commercial Plumbing"
];

const timeOptions = ["Immediately", "Within 2 Hours", "Today", "Tomorrow Morning", "This Week"];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100";

export function BookingForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema)
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitted(true);
    reset();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
      <h3 className="text-xl font-bold text-slate-900">Request Service</h3>
      <p className="mt-2 text-sm text-slate-600">A plumber will contact you within 10 minutes.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Booking form">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
            Name
          </label>
          <input id="name" aria-invalid={!!errors.name} className={inputClass} placeholder="Your full name" {...register("name")} />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">
            Phone Number
          </label>
          <input id="phone" aria-invalid={!!errors.phone} className={inputClass} placeholder="+233 24 123 4567" {...register("phone")} />
          {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p> : null}
        </div>

        <div>
          <label htmlFor="location" className="mb-2 block text-sm font-semibold text-slate-700">
            Location
          </label>
          <input id="location" aria-invalid={!!errors.location} className={inputClass} placeholder="Accra, East Legon" {...register("location")} />
          {errors.location ? <p className="mt-1 text-xs text-red-600">{errors.location.message}</p> : null}
        </div>

        <div>
          <label htmlFor="service" className="mb-2 block text-sm font-semibold text-slate-700">
            Service Needed
          </label>
          <select id="service" aria-invalid={!!errors.service} className={inputClass} defaultValue="" {...register("service")}>
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.service ? <p className="mt-1 text-xs text-red-600">{errors.service.message}</p> : null}
        </div>

        <div>
          <label htmlFor="preferredTime" className="mb-2 block text-sm font-semibold text-slate-700">
            Preferred Time
          </label>
          <select
            id="preferredTime"
            aria-invalid={!!errors.preferredTime}
            className={inputClass}
            defaultValue=""
            {...register("preferredTime")}
          >
            <option value="" disabled>
              Select preferred time
            </option>
            {timeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.preferredTime ? <p className="mt-1 text-xs text-red-600">{errors.preferredTime.message}</p> : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-300 transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-70"
          aria-label="Request plumbing service"
          data-analytics="booking_form_submit"
        >
          {isSubmitting ? "Submitting..." : "Request Service"}
        </button>
      </form>

      {isSubmitted ? (
        <div
          className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          role="status"
          aria-live="polite"
        >
          Request received. A plumbing specialist will reach out shortly.
        </div>
      ) : null}
    </div>
  );
}
