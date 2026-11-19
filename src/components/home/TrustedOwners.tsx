"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const owners = [
  { name: "Carter Heavy Rentals", img:"/bestCompany/constraction.jpg" , rating: 4.9, listings: 24, rentals: 180, tags: ["Construction", "Vehicles"] },
  { name: "LensHub Studio", img:"/bestCompany/lens.jpg", rating: 4.8, listings: 36, rentals: 240, tags: ["Photography", "Electronics"] },
  { name: "GreenField Agro", img:"/bestCompany/agro.jpg", rating: 4.7, listings: 15, rentals: 95, tags: ["Agriculture"] },
  { name: "PulseStage Events", img:"/bestCompany/event.jpg", rating: 5.0, listings: 42, rentals: 310, tags: ["Event", "Electronics"] },
];

const checks = [
  "Owner details reviewed before listing",
  "Every listing approved by an admin",
  "Ratings come from real rentals",
];

export default function TrustedOwners() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-[#EEF4E0] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#3F6212]">Top rated owners</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Our best equipment owners
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#1B1F16]/70">
              Rent from our highest-rated owners, trusted by customers for quality equipment and great service.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1B1F16] px-6 py-3.5 text-sm font-bold text-[#F4F4F2] transition hover:bg-[#2d3326] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
          >
            Become an owner <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>

        {/* Cards */}
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {owners.map((o, i) => (
            <motion.li
              key={o.name}
              initial={{ opacity: 0, y: reduce ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.1 }}
              className="flex h-full flex-col items-center rounded-3xl bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Avatar with verified badge */}
              <div className="relative">
                <Image src={o.img} alt="companyLogo" width={70} height={70} className="rounded-full"/>
                <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#7CB518] ring-4 ring-white" title="Verified owner">
                  <BadgeCheck className="h-5 w-5 text-[#1B1F16]" aria-label="Verified owner" />
                </span>
              </div>

              <h3 className="mt-5 text-lg font-extrabold">{o.name}</h3>
              <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
                <Star className="h-4 w-4 fill-[#7CB518] text-[#7CB518]" aria-hidden />
                {o.rating.toFixed(1)}
                <span className="font-normal text-[#1B1F16]/60">rating</span>
              </p>

              <div className="mt-4 mb-3 flex flex-wrap justify-center gap-2">
                {o.tags.map((t) => (
                  <span key={t} className="rounded-full bg-[#EEF4E0] px-3 py-1 text-xs font-semibold text-[#3F6212]">
                    {t}
                  </span>
                ))}
              </div>

              <dl className="mt-auto grid w-full grid-cols-2 gap-2 border-t border-[#1B1F16]/10 pt-2">
                <div>
                  <dd className="text-xl font-extrabold">{o.listings}</dd>
                  <dt className="text-xs text-[#1B1F16]/60">Listings</dt>
                </div>
                <div>
                  <dd className="text-xl font-extrabold">{o.rentals}+</dd>
                  <dt className="text-xs text-[#1B1F16]/60">Rentals</dt>
                </div>
              </dl>
            </motion.li>
          ))}
        </ul>

        {/* Verification strip */}
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8"
        >
          {checks.map((c) => (
            <li key={c} className="flex items-center gap-2 text-sm font-medium text-[#1B1F16]/80">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#3F6212]" aria-hidden />
              {c}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}