"use client";

import { useMemo, useState } from "react";
import type { RevenuePoint } from "@/lib/data/admin-dashboard";
import { revenue30Days, revenue7Days, revenue90Days } from "@/lib/data/admin-dashboard";
import { cn } from "@/lib/utils";

type Range = "7d" | "30d" | "90d";

const ranges: { id: Range; label: string }[] = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "90d", label: "90D" }
];

function getData(range: Range): RevenuePoint[] {
  if (range === "30d") return revenue30Days;
  if (range === "90d") return revenue90Days;
  return revenue7Days;
}

export function RevenueChart() {
  const [range, setRange] = useState<Range>("7d");
  const data = useMemo(() => getData(range), [range]);
  const max = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Revenue Trend</h2>
          <p className="text-sm text-slate-500">Monitor sales performance with flexible windows.</p>
        </div>
        <div className="inline-flex rounded-lg border p-1">
          {ranges.map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              className={cn(
                "rounded-md px-3 py-1 text-sm",
                range === item.id ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "text-slate-500"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] items-end gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
        {data.map((point) => (
          <div key={point.label} className="space-y-2 text-center">
            <div className="mx-auto flex h-36 w-10 items-end rounded-md bg-slate-200 dark:bg-slate-700">
              <div
                className="w-full rounded-md bg-indigo-500 transition-all duration-500"
                style={{ height: `${Math.max(8, (point.revenue / max) * 100)}%` }}
              />
            </div>
            <p className="text-xs font-medium">{point.label}</p>
            <p className="text-[11px] text-slate-500">${point.revenue.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
