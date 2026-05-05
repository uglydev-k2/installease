import type { ReactNode } from "react";
import { Home, RadioTower, ShieldCheck, Speaker } from "lucide-react";
import { cn } from "@/lib/utils";

type Ecosystem = "alexa" | "google" | "homekit" | "matter";

const map: Record<Ecosystem, { label: string; icon: ReactNode; className: string }> = {
  alexa: { label: "Alexa", icon: <Speaker className="h-3 w-3" />, className: "bg-blue-100 text-blue-700" },
  google: { label: "Google Home", icon: <Home className="h-3 w-3" />, className: "bg-green-100 text-green-700" },
  homekit: { label: "Apple HomeKit", icon: <ShieldCheck className="h-3 w-3" />, className: "bg-slate-200 text-slate-700" },
  matter: { label: "Matter", icon: <RadioTower className="h-3 w-3" />, className: "bg-purple-100 text-purple-700" }
};

export function EcosystemBadge({ ecosystem }: { ecosystem: Ecosystem }) {
  const item = map[ecosystem];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium", item.className)}>
      {item.icon}
      {item.label}
    </span>
  );
}
