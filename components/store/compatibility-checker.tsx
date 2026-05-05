"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Ecosystem } from "@/lib/types/product";

const options: Ecosystem[] = ["alexa", "google", "homekit", "matter"];

export function CompatibilityChecker({ supported }: { supported: Ecosystem[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Ecosystem[]>([]);

  const result = useMemo(() => {
    if (!selected.length) return "Select your existing hubs to check compatibility.";
    const matches = selected.filter((hub) => supported.includes(hub)).length;
    if (matches === selected.length) return "Compatible: all selected hubs are supported.";
    if (matches > 0) return "Partially Compatible: only some selected hubs are supported.";
    return "Not Compatible: none of the selected hubs are supported.";
  }, [selected, supported]);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Check Compatibility
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/50 p-4">
          <div className="mx-auto mt-24 max-w-md rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900">
            <h3 className="text-lg font-semibold">Compatibility Checker</h3>
            <p className="mt-1 text-sm text-slate-500">Select your current smart home hubs.</p>
            <div className="mt-4 space-y-2">
              {options.map((hub) => (
                <label key={hub} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.includes(hub)}
                    onChange={(e) =>
                      setSelected((prev) =>
                        e.target.checked ? [...prev, hub] : prev.filter((item) => item !== hub)
                      )
                    }
                  />
                  {hub}
                </label>
              ))}
            </div>
            <p className="mt-4 rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800">{result}</p>
            <Button className="mt-4 w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
