"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Search,
  MapPin,
  ShieldCheck,
  CalendarClock,
  CreditCard,
  BadgeCheck,
} from "lucide-react";

/**
 * EasyRent hero banner
 * Needs: npm i framer-motion lucide-react
 * Image: put a photo at /public/images/hero-equipment.jpg
 *        (search Unsplash / Pexels for "excavator", "construction site", "heavy equipment")
 * Colors are written as Tailwind arbitrary values so no config change is needed.
 *   bg #F4F4F2 | ink #1B1F16 | lime #7CB518 | deep green #3F6212
 */

const trust = [
  { icon: ShieldCheck, text: "Verified equipment owners" },
  { icon: CalendarClock, text: "Rent daily, weekly or monthly" },
  { icon: CreditCard, text: "Secure payment with Stripe" },
];

const Banner = () => {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const onSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (name.trim()) params.set("search", name.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/all-equipment?${params.toString()}`); // change to your route
  };

  // One orchestrated entrance for the whole banner
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: message + search */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#3F6212]"
          >
            <span>Find It</span>
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#7CB518]"
              aria-hidden
            />
            <span>Rent It</span>
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#7CB518]"
              aria-hidden
            />
            <span>Use It</span>
          </motion.p>

          <motion.h1
            variants={item}
            className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[56px]"
          >
            Everything You Need, Ready to Rent.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-lg text-base leading-relaxed text-[#1B1F16]/70 sm:text-md"
          >
            Discover and rent quality tools, machinery, and equipment for every
            project. Simple booking, flexible rentals, and reliable service.
          </motion.p>

          {/* Search */}
          <motion.form
            variants={item}
            onSubmit={onSearch}
            className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-[#1B1F16]/10 bg-white p-2 shadow-sm sm:flex-row sm:items-center"
          >
            <label className="flex flex-1 items-center gap-2 px-3 py-2">
              <Search className="h-5 w-5 shrink-0 text-[#3F6212]" aria-hidden />
              <span className="sr-only">Equipment name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What do you need?"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#1B1F16]/45"
              />
            </label>
            <span className="hidden h-8 w-px bg-[#1B1F16]/10 sm:block" />
            <label className="flex flex-1 items-center gap-2 px-3 py-2">
              <MapPin className="h-5 w-5 shrink-0 text-[#3F6212]" aria-hidden />
              <span className="sr-only">Location</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#1B1F16]/45"
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-[#7CB518] px-6 py-3 text-sm font-bold text-white cursor-pointer transition hover:bg-[#6aa00f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
            >
              Search
            </button>
          </motion.form>

          <motion.div
            variants={item}
            className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
          >
            <Link
              href="/all-equipment"
              className="font-semibold text-[#3F6212] underline-offset-4 hover:underline"
            >
              Browse all equipment
            </Link>
            <Link
              href="/register"
              className="font-semibold text-[#1B1F16]/70 underline-offset-4 hover:underline"
            >
              List your equipment
            </Link>
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-10 grid gap-3 sm:grid-cols-3"
          >
            {trust.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2 text-xs font-medium text-[#1B1F16]/80"
              >
                <Icon className="h-5 w-5 shrink-0 text-[#3F6212]" aria-hidden />
                {text}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right: image + rental tag */}
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[5/4]">
            <Image
              src="/bannarImg.png"
              alt="Heavy equipment ready to rent"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-contain object-center"
            />
          </div>

          {/* The memorable element: a rental tag that swings in once */}
          {/* <motion.div
            initial={{
              opacity: 0,
              rotate: reduce ? -3 : -14,
              y: reduce ? 0 : -20,
            }}
            animate={{ opacity: 1, rotate: -3, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 9,
              delay: 0.9,
            }}
            style={{ transformOrigin: "top left" }}
            className="absolute -left-3 bottom-0 w-56 rounded-2xl bg-[#7CB518] p-4 text-[#1B1F16] shadow-xl sm:-left-8"
          >
            <p className="text-xs font-semibold">Excavator 20T</p>
            <p className="mt-1 text-3xl font-extrabold leading-none">
              $85<span className="text-sm font-bold"> / day</span>
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-[#1B1F16]/20 pt-3 text-xs font-semibold">
              <span>Available now</span>
              <span className="rounded-full bg-[#1B1F16] px-2.5 py-1 text-[#F4F4F2]">
                Book
              </span>
            </div>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
