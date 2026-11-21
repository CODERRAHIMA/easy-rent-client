export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl py-8">
        <div className="h-5 w-32 animate-pulse rounded bg-[#1B1F16]/10" />
        <div className="mt-4 h-12 max-w-xl animate-pulse rounded-xl bg-[#1B1F16]/10" />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="h-[380px] animate-pulse rounded-3xl bg-[#1B1F16]/5" />
          ))}
        </ul>
      </div>
    </main>
  );
}