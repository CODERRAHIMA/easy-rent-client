// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import {
//   Search, MapPin, CalendarClock, SlidersHorizontal, X, ChevronLeft, ChevronRight,
//   PackageSearch, Wrench, ArrowRight,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from "@/components/ui/select";

// const CURRENCY = "৳"; 

// const categories = [
//   "Construction Equipment",
//   "Photography Equipment",
//   "Vehicles & Transportation",
//   "Agriculture Equipment",
//   "Electronics",
//   "Event Equipment",
// ];
// const rentalTypes = ["Daily", "Weekly", "Monthly"];
// const availabilityOptions = ["Available", "Unavailable"];
// const sortOptions = [
//   { value: "newest", label: "Recently added" },
//   { value: "price-asc", label: "Price: low to high" },
//   { value: "price-desc", label: "Price: high to low" },
// ];
// const unit: Record<string, string> = { Daily: "day", Weekly: "week", Monthly: "month" };

// // TODO: remove this dummy data and use the equipment fetched from your backend
// const dummy = [
//   { _id: "1", name: "Caterpillar Excavator 320D", category: "Construction Equipment", image: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=1000", location: "Sylhet, Bangladesh", rentalPrice: 12000, rentalType: "Daily", availableQuantity: 3 },
//   { _id: "2", name: "Canon EOS R6 Camera Kit", category: "Photography Equipment", image: "", location: "Dhaka, Bangladesh", rentalPrice: 3500, rentalType: "Daily", availableQuantity: 5 },
//   { _id: "3", name: "Mahindra Compact Tractor", category: "Agriculture Equipment", image: "", location: "Sylhet, Bangladesh", rentalPrice: 40000, rentalType: "Weekly", availableQuantity: 2 },
//   { _id: "4", name: "JBL Stage Speaker Set", category: "Event Equipment", image: "", location: "Chattogram, Bangladesh", rentalPrice: 8000, rentalType: "Daily", availableQuantity: 0 },
//   { _id: "5", name: "Toyota Hiace Van", category: "Vehicles & Transportation", image: "", location: "Dhaka, Bangladesh", rentalPrice: 90000, rentalType: "Monthly", availableQuantity: 4 },
//   { _id: "6", name: "Concrete Mixer 350L", category: "Construction Equipment", image: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=1000", location: "Sylhet, Bangladesh", rentalPrice: 2500, rentalType: "Daily", availableQuantity: 6 },
//   { _id: "7", name: "4K Projector Pro", category: "Electronics", image: "", location: "Khulna, Bangladesh", rentalPrice: 4200, rentalType: "Daily", availableQuantity: 2 },
//   { _id: "8", name: "LED Stage Lighting Kit", category: "Event Equipment", image: "", location: "Dhaka, Bangladesh", rentalPrice: 22000, rentalType: "Weekly", availableQuantity: 3 },
//   { _id: "9", name: "DJI Mavic Drone", category: "Electronics", image: "", location: "Sylhet, Bangladesh", rentalPrice: 5000, rentalType: "Daily", availableQuantity: 1 },
//   { _id: "10", name: "Caterpillar Excavator 320D", category: "Construction Equipment", image: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=1000", location: "Sylhet, Bangladesh", rentalPrice: 12000, rentalType: "Daily", availableQuantity: 3 },
//   { _id: "11", name: "Canon EOS R6 Camera Kit", category: "Photography Equipment", image: "", location: "Dhaka, Bangladesh", rentalPrice: 3500, rentalType: "Daily", availableQuantity: 5 },
//   { _id: "12", name: "Mahindra Compact Tractor", category: "Agriculture Equipment", image: "", location: "Sylhet, Bangladesh", rentalPrice: 40000, rentalType: "Weekly", availableQuantity: 2 },
//   { _id: "13", name: "JBL Stage Speaker Set", category: "Event Equipment", image: "", location: "Chattogram, Bangladesh", rentalPrice: 8000, rentalType: "Daily", availableQuantity: 0 },
//   { _id: "14", name: "Toyota Hiace Van", category: "Vehicles & Transportation", image: "", location: "Dhaka, Bangladesh", rentalPrice: 90000, rentalType: "Monthly", availableQuantity: 4 },
//   { _id: "15", name: "Concrete Mixer 350L", category: "Construction Equipment", image: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=1000", location: "Sylhet, Bangladesh", rentalPrice: 2500, rentalType: "Daily", availableQuantity: 6 },
//   { _id: "16", name: "4K Projector Pro", category: "Electronics", image: "", location: "Khulna, Bangladesh", rentalPrice: 4200, rentalType: "Daily", availableQuantity: 2 },
//   { _id: "17", name: "LED Stage Lighting Kit", category: "Event Equipment", image: "", location: "Dhaka, Bangladesh", rentalPrice: 22000, rentalType: "Weekly", availableQuantity: 3 },
//   { _id: "18", name: "DJI Mavic Drone", category: "Electronics", image: "", location: "Sylhet, Bangladesh", rentalPrice: 5000, rentalType: "Daily", availableQuantity: 1 },
//   { _id: "19", name: "Caterpillar Excavator 320D", category: "Construction Equipment", image: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=1000", location: "Sylhet, Bangladesh", rentalPrice: 12000, rentalType: "Daily", availableQuantity: 3 },
//   { _id: "20", name: "Canon EOS R6 Camera Kit", category: "Photography Equipment", image: "", location: "Dhaka, Bangladesh", rentalPrice: 3500, rentalType: "Daily", availableQuantity: 5 },
//   { _id: "21", name: "Mahindra Compact Tractor", category: "Agriculture Equipment", image: "", location: "Sylhet, Bangladesh", rentalPrice: 40000, rentalType: "Weekly", availableQuantity: 2 },
//   { _id: "22", name: "JBL Stage Speaker Set", category: "Event Equipment", image: "", location: "Chattogram, Bangladesh", rentalPrice: 8000, rentalType: "Daily", availableQuantity: 0 },
//   { _id: "23", name: "Toyota Hiace Van", category: "Vehicles & Transportation", image: "", location: "Dhaka, Bangladesh", rentalPrice: 90000, rentalType: "Monthly", availableQuantity: 4 },
//   { _id: "24", name: "Concrete Mixer 350L", category: "Construction Equipment", image: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=1000", location: "Sylhet, Bangladesh", rentalPrice: 2500, rentalType: "Daily", availableQuantity: 6 },
//   { _id: "25", name: "4K Projector Pro", category: "Electronics", image: "", location: "Khulna, Bangladesh", rentalPrice: 4200, rentalType: "Daily", availableQuantity: 2 },
// ]

// type Filters = {
//   search: string;
//   location: string;
//   category: string;
//   rentalType: string;
//   availability: string;
//   minPrice: string;
//   maxPrice: string;
//   sort: string;
// };
// const initialFilters: Filters = {
//   search: "", location: "", category: "", rentalType: "",
//   availability: "", minPrice: "", maxPrice: "", sort: "newest",
// };

// const fieldCls =
//   "h-11 rounded-xl border-[#1B1F16]/15 bg-white focus-visible:border-[#7CB518] focus-visible:ring-[#7CB518]/25";

// function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       aria-pressed={active}
//       className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
//         active
//           ? "border-[#1B1F16] bg-[#1B1F16] text-[#F4F4F2]"
//           : "border-[#1B1F16]/15 bg-white text-[#1B1F16]/70 hover:border-[#7CB518]"
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// export default function AllEquipmentPage() {
//   const [filters, setFilters] = useState<Filters>(initialFilters);
//   const [showFilters, setShowFilters] = useState(false); // mobile only
//   const [page, setPage] = useState(1);

//   // TODO: replace with data from your backend
//   const items = dummy;
//   const loading = false; // TODO: set true while fetching (shows skeleton cards)
//   const totalItems = items.length; // TODO: total count returned by the backend
//   const totalPages = 3; // TODO: Math.ceil(totalItems / limit) from the backend

//   const update = (key: keyof Filters, value: string) => {
//     setFilters((f) => ({ ...f, [key]: f[key] === value && key !== "sort" ? "" : value }));
//     setPage(1);
//   };
//   const reset = () => { setFilters(initialFilters); setPage(1); };

//   const activeCount = [filters.category, filters.rentalType, filters.availability, filters.minPrice, filters.maxPrice]
//     .filter(Boolean).length;

//   /*
//    * TODO: server-side search, filter, sort and pagination
//    * Whenever `filters` or `page` change (debounce the text inputs), fetch from your backend:
//    *
//    *   const params = new URLSearchParams({
//    *     search: filters.search, location: filters.location, category: filters.category,
//    *     rentalType: filters.rentalType, availability: filters.availability,
//    *     minPrice: filters.minPrice, maxPrice: filters.maxPrice,
//    *     sort: filters.sort, page: String(page), limit: "9",
//    *   });
//    *   GET `${process.env.NEXT_PUBLIC_API_URL}/equipment?${params}`   // only status: "approved"
//    *
//    * Backend: build a MongoDB query from these params and sort by rentalPrice or createdAt.
//    * Tip: keep the filters in the URL (useSearchParams) so reload and sharing keep the same results.
//    */
//   const handleSearch = () => {
//     setPage(1);
//     // TODO: run the search (fetch with the current filters)
//     console.log("Search with filters:", filters);
//   };

//   return (
//     <main className="min-h-screen bg-[#F4F4F2] text-[#1B1F16]">
//       <div className="mx-auto max-w-7xl pt-8">
//         {/* Header */}
//         <p className="text-sm font-bold uppercase tracking-widest text-[#3F6212]">All equipment</p>
//         <h1 className="mt-3 max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
//           Find the right equipment
//         </h1>
//         <p className="mt-4 max-w-xl text-base leading-relaxed text-[#1B1F16]/70">
//           Browse approved equipment from verified owners and rent it for the time you need.
//         </p>

//         {/* Search bar */}
//         <form
//           onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
//           className="mt-8 flex flex-col gap-2 rounded-2xl border border-[#1B1F16]/10 bg-white p-2 shadow-sm sm:flex-row sm:items-center"
//         >
//           <label className="flex flex-1 items-center gap-2 px-3 py-2">
//             <Search className="h-5 w-5 shrink-0 text-[#3F6212]" aria-hidden />
//             <span className="sr-only">Equipment name</span>
//             <input
//               value={filters.search}
//               onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
//               placeholder="Search by equipment name"
//               className="w-full bg-transparent text-sm outline-none placeholder:text-[#1B1F16]/45"
//             />
//           </label>
//           <span className="hidden h-8 w-px bg-[#1B1F16]/10 sm:block" />
//           <label className="flex flex-1 items-center gap-2 px-3 py-2">
//             <MapPin className="h-5 w-5 shrink-0 text-[#3F6212]" aria-hidden />
//             <span className="sr-only">Location</span>
//             <input
//               value={filters.location}
//               onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
//               placeholder="Location"
//               className="w-full bg-transparent text-sm outline-none placeholder:text-[#1B1F16]/45"
//             />
//           </label>
//           <Button type="submit" className="h-12 rounded-xl bg-[#7CB518] px-8 text-sm font-bold text-[#1B1F16] hover:bg-[#6aa00f]">
//             Search
//           </Button>
//         </form>

//         <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
//           {/* Filters */}
//           <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
//             <div className="space-y-7 rounded-3xl border border-[#1B1F16]/10 bg-white p-6 lg:sticky lg:top-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-lg font-extrabold">Filters</h2>
//                 {activeCount > 0 && (
//                   <button type="button" onClick={reset} className="flex items-center gap-1 text-xs font-bold text-[#3F6212] hover:underline">
//                     <X className="h-3.5 w-3.5" aria-hidden /> Clear all
//                   </button>
//                 )}
//               </div>

//               <div>
//                 <Label className="text-sm font-semibold">Category</Label>
//                 <ul className="mt-3 space-y-1.5">
//                   {categories.map((c) => {
//                     const active = filters.category === c;
//                     return (
//                       <li key={c}>
//                         <button
//                           type="button"
//                           onClick={() => update("category", c)}
//                           aria-pressed={active}
//                           className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
//                             active ? "bg-[#EEF4E0] font-bold text-[#3F6212]" : "text-[#1B1F16]/70 hover:bg-[#F4F4F2]"
//                           }`}
//                         >
//                           <span className={`h-2 w-2 rounded-full ${active ? "bg-[#7CB518]" : "bg-[#1B1F16]/20"}`} />
//                           {c}
//                         </button>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>

//               <div>
//                 <Label className="text-sm font-semibold">Rental type</Label>
//                 <div className="mt-3 flex flex-wrap gap-2">
//                   {rentalTypes.map((t) => (
//                     <Pill key={t} active={filters.rentalType === t} onClick={() => update("rentalType", t)}>{t}</Pill>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <Label className="text-sm font-semibold">Price range</Label>
//                 <div className="mt-3 flex items-center gap-2">
//                   <Input type="number" min={0} value={filters.minPrice} onChange={(e) => update("minPrice", e.target.value)} placeholder="Min" aria-label="Minimum price" className={fieldCls} />
//                   <span className="text-[#1B1F16]/40">-</span>
//                   <Input type="number" min={0} value={filters.maxPrice} onChange={(e) => update("maxPrice", e.target.value)} placeholder="Max" aria-label="Maximum price" className={fieldCls} />
//                 </div>
//               </div>

//               <div>
//                 <Label className="text-sm font-semibold">Availability</Label>
//                 <div className="mt-3 flex flex-wrap gap-2">
//                   {availabilityOptions.map((a) => (
//                     <Pill key={a} active={filters.availability === a} onClick={() => update("availability", a)}>{a}</Pill>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </aside>

//           {/* Results */}
//           <section>
//             {/* Toolbar */}
//             <div className="flex flex-wrap items-center justify-between gap-3">
//               <div className="flex items-center gap-3">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setShowFilters((s) => !s)}
//                   className="h-10 rounded-xl border-[#1B1F16]/15 bg-white font-bold hover:border-[#7CB518] hover:bg-white lg:hidden"
//                 >
//                   <SlidersHorizontal className="h-4 w-4 text-[#3F6212]" aria-hidden />
//                   Filters{activeCount > 0 && ` (${activeCount})`}
//                 </Button>
//                 <p className="text-sm text-[#1B1F16]/70">
//                   <span className="font-bold text-[#1B1F16]">{totalItems}</span> items found
//                 </p>
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className="hidden text-sm text-[#1B1F16]/60 sm:block">Sort by</span>
//                 <Select value={filters.sort} onValueChange={(v: string | null) => update("sort", v ?? "newest")}>
//                   <SelectTrigger className={`${fieldCls} w-[190px]`}><SelectValue placeholder="Sort by" /></SelectTrigger>
//                   <SelectContent>
//                     {sortOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Loading skeleton */}
//             {loading ? (
//               <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                 {Array.from({ length: 6 }).map((_, i) => (
//                   <li key={i} className="h-[380px] animate-pulse rounded-3xl bg-[#1B1F16]/5" />
//                 ))}
//               </ul>
//             ) : items.length === 0 ? (
//               /* Empty state */
//               <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-[#1B1F16]/20 bg-white px-6 py-16 text-center">
//                 <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4E0] text-[#3F6212]">
//                   <PackageSearch className="h-7 w-7" aria-hidden />
//                 </span>
//                 <h3 className="mt-4 text-lg font-extrabold">No equipment found</h3>
//                 <p className="mt-1 max-w-sm text-sm text-[#1B1F16]/60">Try changing your search or clearing some filters.</p>
//                 <Button onClick={reset} className="mt-5 rounded-xl bg-[#7CB518] font-bold text-[#1B1F16] hover:bg-[#6aa00f]">Clear filters</Button>
//               </div>
//             ) : (
//               /* Cards: 3-column grid, equal height */
//               <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                 {items.map((item) => {
//                   const available = item.availableQuantity > 0;
//                   return (
//                     <li
//                       key={item._id}
//                       className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#1B1F16]/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
//                     >
//                       {/* Image */}
//                       <div className="relative aspect-[4/3] overflow-hidden bg-[#EEF4E0]">
//                         {item.image ? (
//                           // eslint-disable-next-line @next/next/no-img-element
//                           <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
//                         ) : (
//                           <div className="flex h-full w-full items-center justify-center text-[#3F6212]/40">
//                             <Wrench className="h-12 w-12" aria-hidden />
//                           </div>
//                         )}
//                         <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-full bg-[#F4F4F2] px-3 py-1 text-xs font-semibold">
//                           {item.category}
//                         </span>
//                         <span
//                           className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
//                             available ? "bg-[#7CB518] text-[#1B1F16]" : "bg-[#1B1F16] text-[#F4F4F2]"
//                           }`}
//                         >
//                           {available ? "Available" : "Unavailable"}
//                         </span>
//                       </div>

//                       {/* Body */}
//                       <div className="flex flex-1 flex-col p-5">
//                         <h3 className="line-clamp-1 text-lg font-extrabold">{item.name}</h3>

//                         <ul className="mt-3 space-y-1.5 text-sm text-[#1B1F16]/70">
//                           <li className="flex items-center gap-2">
//                             <MapPin className="h-4 w-4 shrink-0 text-[#3F6212]" aria-hidden />
//                             <span className="truncate">{item.location}</span>
//                           </li>
//                           <li className="flex items-center gap-2">
//                             <CalendarClock className="h-4 w-4 shrink-0 text-[#3F6212]" aria-hidden />
//                             {item.rentalType} rental
//                           </li>
//                         </ul>

//                         <div className="mt-auto pt-5">
//                           <p className="text-2xl font-extrabold leading-none">
//                             {CURRENCY}{item.rentalPrice.toLocaleString()}
//                             <span className="text-sm font-semibold text-[#1B1F16]/60"> / {unit[item.rentalType]}</span>
//                           </p>
//                           {/* TODO: if the user is not logged in, redirect to /login instead.
//                               If logged in, go to the details page (private route). */}
//                           <Link
//                             href={`/all-equipment/${item._id}`}
//                             className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1B1F16] text-sm font-bold text-[#F4F4F2] transition hover:bg-[#2d3326] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
//                           >
//                             View details <ArrowRight className="h-4 w-4" aria-hidden />
//                           </Link>
//                         </div>
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}

//             {/* Pagination (optional requirement) */}
//             {!loading && items.length > 0 && (
//               <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   disabled={page === 1}
//                   onClick={() => setPage((p) => p - 1)}
//                   aria-label="Previous page"
//                   className="rounded-xl border-[#1B1F16]/15 bg-white hover:border-[#7CB518] hover:bg-white"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
//                   <button
//                     key={n}
//                     onClick={() => setPage(n)}
//                     aria-current={page === n ? "page" : undefined}
//                     className={`h-9 w-9 rounded-xl text-sm font-bold transition ${
//                       page === n ? "bg-[#7CB518] text-[#1B1F16]" : "bg-white text-[#1B1F16]/70 hover:bg-[#EEF4E0]"
//                     }`}
//                   >
//                     {n}
//                   </button>
//                 ))}
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   disabled={page === totalPages}
//                   onClick={() => setPage((p) => p + 1)}
//                   aria-label="Next page"
//                   className="rounded-xl border-[#1B1F16]/15 bg-white hover:border-[#7CB518] hover:bg-white"
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </nav>
//             )}
//           </section>
//         </div>
//       </div>
//     </main>
//   );
// }