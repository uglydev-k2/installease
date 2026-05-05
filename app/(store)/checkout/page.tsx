export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="rounded-xl border p-5">
        <p className="font-semibold">Step 1: Delivery</p>
        <p className="text-sm text-slate-500">Address form and shipping options will render here.</p>
      </div>
      <div className="rounded-xl border p-5">
        <p className="font-semibold">Step 2: Payment</p>
        <p className="text-sm text-slate-500">Stripe Elements and alternate payment methods go here.</p>
      </div>
      <div className="rounded-xl border p-5">
        <p className="font-semibold">Step 3: Review</p>
        <p className="text-sm text-slate-500">Final order review and place-order action.</p>
      </div>
    </div>
  );
}
