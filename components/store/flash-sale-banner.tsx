"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export function FlashSaleBanner() {
  const deadline = useMemo(() => Date.now() + 1000 * 60 * 60 * 36, []);
  const [remaining, setRemaining] = useState(deadline - Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, deadline - Date.now()));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const m = Math.floor((remaining / (1000 * 60)) % 60);
  const s = Math.floor((remaining / 1000) % 60);

  return (
    <section className="rounded-2xl bg-indigo-500 p-6 text-white shadow-lg">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide">Flash Sale</p>
          <h2 className="text-2xl font-bold">Save up to 40% on smart security bundles</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/20 px-3 py-2 font-mono text-sm">
            {d}d {h}h {m}m {s}s
          </div>
          <Button variant="secondary">Shop Sale</Button>
        </div>
      </div>
    </section>
  );
}
