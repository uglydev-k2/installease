"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function VerifyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Verifying payment…");

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (!reference) {
      setMessage("Missing payment reference.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`);
        const body = (await res.json()) as {
          success?: boolean;
          orderId?: number;
          error?: string;
          sessionPayload?: Record<string, unknown>;
        };
        if (cancelled) return;
        if (!res.ok || !body.success || !body.sessionPayload) {
          setMessage(body.error ?? "Verification failed.");
          return;
        }
        try {
          sessionStorage.setItem("installease_checkout_success", JSON.stringify(body.sessionPayload));
        } catch {
          /* ignore */
        }
        router.replace("/checkout/success");
      } catch {
        if (!cancelled) setMessage("Could not verify payment.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 py-24 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#0F172A]" />
      <p className="text-sm text-[#374151]">{message}</p>
      <Link href="/checkout" className="text-sm font-semibold text-indigo-600 underline">
        Back to checkout
      </Link>
    </div>
  );
}

export default function CheckoutVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-[#0F172A]" />
        </div>
      }
    >
      <VerifyInner />
    </Suspense>
  );
}
