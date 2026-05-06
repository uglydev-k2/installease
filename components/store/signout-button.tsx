"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SignOutButtonProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "secondary" | "outline";
}

export function SignOutButton({ className, size = "sm", variant = "outline" }: SignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.refresh();
    router.push("/");
  }

  return (
    <Button type="button" size={size} variant={variant} className={className} onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
