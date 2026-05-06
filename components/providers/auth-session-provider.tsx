"use client";

import { createContext, useContext } from "react";
import type { Session } from "@supabase/supabase-js";

const AuthSessionContext = createContext<Session | null>(null);

export function AuthSessionProvider({
  initialSession,
  children
}: {
  initialSession: Session | null;
  children: React.ReactNode;
}) {
  return <AuthSessionContext.Provider value={initialSession}>{children}</AuthSessionContext.Provider>;
}

export function useInitialSession() {
  return useContext(AuthSessionContext);
}
