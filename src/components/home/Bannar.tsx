"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  fadeScaleVariants,
  fadeUpVariants,
  staggerVariants,
} from "../utils/animation";
import { Search, ShieldCheck, CalendarClock, CreditCard } from "lucide-react";

const trust = [
  { icon: ShieldCheck, text: "Verified equipment owners" },
  { icon: CalendarClock, text: "Rent daily, weekly or monthly" },
  { icon: CreditCard, text: "Secure payment with Stripe" },
];

const Banner = () => {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [name, setName] = useState("");

  const onSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (name.trim()) params.set("search", name.trim());
    router.push(`/all-equipment?${params.toString()}`); // change to your route
  };

  const container = staggerVariants(reduce, 0.12, "show");
  const item = fadeUpVariants(reduce, 24, 0.6, "show");

  return (
    <section className="bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] xl:px-0">
        {/* Left: message + search */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center md:items-start md:text-left"
        >
          <motion.p
            variants={item}
            className="mb-4 flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#3F6212] md:justify-start"
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
            className="w-full max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[56px]"
          >
            Everything You Need, Ready to Rent.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 w-full max-w-lg text-base leading-relaxed text-[#1B1F16]/70 sm:text-md"
          >
            Discover and rent quality tools, machinery, and equipment for every
            project. Simple booking, flexible rentals, and reliable service.
          </motion.p>

          {/* Search */}
          {/* <motion.form
            variants={item}
            onSubmit={onSearch}
            className="mt-8 flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-[#1B1F16]/10 bg-white p-2 shadow-sm sm:flex-row sm:items-center"
          >
            <label className="flex flex-1 items-center gap-2 px-3 py-2">
              <Search className="h-5 w-5 shrink-0 text-[#3F6212]" aria-hidden />
              <span className="sr-only">Equipment name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What do you need? e.g. excavator"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#1B1F16]/45"
              />
            </label>

            <button
              type="submit"
              className="rounded-xl bg-[#7CB518] px-6 py-3 text-sm font-bold text-white cursor-pointer transition hover:bg-[#6aa00f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
            >
              Search
            </button>
          </motion.form> */}
          <motion.form
            variants={item}
            onSubmit={onSearch}
            className="mt-6 flex w-full max-w-xl flex-row items-center gap-1.5 rounded-2xl border border-[#1B1F16]/10 bg-white p-1.5 shadow-sm sm:mt-8 sm:gap-2 sm:p-2"
          >
            <label className="flex min-w-0 flex-1 items-center gap-2 pl-2.5 pr-1 py-1.5 sm:px-3 sm:py-2">
              <Search
                className="size-4 shrink-0 text-[#3F6212] sm:size-5"
                aria-hidden
              />
              <span className="sr-only">Equipment name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What do you need? e.g. excavator"
                className="w-full min-w-0 truncate bg-transparent text-xs outline-none placeholder:text-[#1B1F16]/45 sm:text-sm"
              />
            </label>

            <button
              type="submit"
              className="shrink-0 cursor-pointer rounded-xl bg-[#7CB518] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#6aa00f] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212] sm:px-6 sm:py-3 sm:text-sm"
            >
              Search
            </button>
          </motion.form>

          <motion.div
            variants={item}
            className="mt-5 flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm md:justify-start"
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
            className="mt-10 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {trust.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2 text-left text-xs font-medium text-[#1B1F16]/80"
              >
                <Icon className="h-5 w-5 shrink-0 text-[#3F6212]" aria-hidden />
                {text}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right: image + rental tag */}
        <motion.div
          variants={fadeScaleVariants(reduce, 0.96, 0.8, 0.2)}
          initial="hidden"
          animate="visible"
          className="relative w-full"
        >
          <div className="relative aspect-[4/3] w-full sm:aspect-[5/4]">
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
