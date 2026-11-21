export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F4F4F2] px-5 py-10 text-[#1B1F16] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-8 animate-pulse rounded-xl bg-[#1B1F16]/10" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="aspect-[4/3] animate-pulse rounded-3xl bg-[#1B1F16]/10" />
          <div className="h-96 animate-pulse rounded-3xl bg-[#1B1F16]/10" />
        </div>
      </div>
    </main>
  );
}