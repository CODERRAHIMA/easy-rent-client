export default function Loading() {
  return (
    <section
      role="status"
      aria-label="Loading"
      className="flex min-h-[50vh] w-full flex-1 flex-col items-center justify-center gap-4 bg-[#F4F4F2] px-5 py-16 text-[#1B1F16]"
    >
      <span
        className="size-10 animate-spin rounded-full border-[3px] border-black/15 border-t-black"
        aria-hidden="true"
      />
      <p className="text-sm font-semibold text-[#1B1F16]/70">Loading...</p>
    </section>
  );
}
