import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Account</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/account/orders" className="rounded-xl border p-4">Orders</Link>
        <Link href="/account/wishlist" className="rounded-xl border p-4">Wishlist</Link>
        <Link href="/account/devices" className="rounded-xl border p-4">My Devices</Link>
      </div>
    </div>
  );
}
