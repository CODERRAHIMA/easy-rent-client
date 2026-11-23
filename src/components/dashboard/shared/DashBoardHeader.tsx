"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, House, Menu, Wrench, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const baseLinks = [
  { label: "Home", href: "/", icon: House },
  { label: "All Equipment", href: "/all-equipment", icon: Wrench },
];

export default function DashboardHeaderMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={open ? "Close quick menu" : "Open quick menu"}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#1B1F16]/20 bg-black text-white px-3 text-md font-bold transition hover:border-[#7CB518] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
      >
        {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
        
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-2xl border border-[#1B1F16]/10 bg-white p-2 shadow-lg"
      >
        <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-[#3F6212]">Quick links</p>

        <nav className="flex flex-col gap-1">
          {baseLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1B1F16] transition hover:bg-[#EEF4E0] hover:text-[#3F6212]"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF4E0] text-[#3F6212]">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              {label}
              <ArrowUpRight
                className="ml-auto size-4 text-[#1B1F16]/30 transition group-hover:text-[#3F6212]"
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>
      </PopoverContent>
    </Popover>
  );
}