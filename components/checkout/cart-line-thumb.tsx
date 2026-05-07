"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

type CartLineThumbProps = {
  imageUrl?: string;
  name: string;
  quantity: number;
  size?: number;
  className?: string;
};

export function CartLineThumb({ imageUrl, name, quantity, size = 60, className }: CartLineThumbProps) {
  const s = `${size}px`;
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-lg bg-[#F3F4F6]", className)} style={{ width: s, height: s }}>
      {imageUrl ? (
        <Image src={imageUrl} alt={name} width={size} height={size} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#9CA3AF]">
          <Package className="h-6 w-6" />
        </div>
      )}
      <span
        className="absolute flex items-center justify-center rounded-full bg-[#0F172A] text-[11px] font-semibold leading-none text-white"
        style={{ top: -6, right: -6, width: 20, height: 20 }}
      >
        {quantity}
      </span>
    </div>
  );
}
