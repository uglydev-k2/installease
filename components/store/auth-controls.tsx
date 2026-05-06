"use client";

import Link from "next/link";
import { SignOutButton } from "@/components/store/signout-button";

interface AuthControlsProps {
  isAuthenticated: boolean;
  email?: string | null;
}

export function AuthControls({ isAuthenticated, email }: AuthControlsProps) {
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/signin">Log in</Link>
        <span>|</span>
        <Link href="/signup">Create Account</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full bg-green-100 px-2 py-1 text-[11px] font-semibold text-green-700">Logged in</span>
      {email ? <span className="max-w-[220px] truncate">{email}</span> : null}
      <SignOutButton />
    </div>
  );
}
