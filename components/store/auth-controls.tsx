"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@/components/store/signout-button";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function AuthControls() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh();
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const email = useMemo(() => user?.email ?? null, [user]);

  if (!user) {
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
