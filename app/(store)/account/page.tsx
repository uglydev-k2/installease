import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

async function getAccountRole() {
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return null;
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    return data?.role ?? "customer";
  } catch {
    return null;
  }
}

export default async function AccountPage() {
  const role = await getAccountRole();
  const isAdmin = role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">My Account</h1>
        {role ? (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isAdmin ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"
            }`}
          >
            {isAdmin ? "Admin" : "Customer"}
          </span>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/account/orders" className="rounded-xl border p-4">Orders</Link>
        <Link href="/account/wishlist" className="rounded-xl border p-4">Wishlist</Link>
        <Link href="/account/devices" className="rounded-xl border p-4">My Devices</Link>
      </div>
      {isAdmin ? (
        <Link href="/admin" className="inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Open Admin Dashboard
        </Link>
      ) : null}
    </div>
  );
}
