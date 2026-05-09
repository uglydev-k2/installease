export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6 px-4 py-10">
      <div className="h-10 w-40 rounded-lg bg-slate-200" />
      <div className="h-64 rounded-2xl bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="h-40 rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-slate-200" />
    </div>
  );
}
