"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeDollarSign, ShieldCheck, CalendarClock, Lock, ArrowRight } from "lucide-react";

const features = [
  { icon: BadgeDollarSign, title: "Affordable prices", text: "Pay only for the days you need." },
  { icon: ShieldCheck, title: "Verified owners", text: "Every listing is admin-approved." },
  { icon: CalendarClock, title: "Flexible periods", text: "Daily, weekly or monthly." },
  { icon: Lock, title: "Secure payments", text: "Protected by Stripe checkout." },
];

export default function WhyChooseUs() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-[#1B1F16] py-10">
      <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-[2rem]  p-6 text-[#F4F4F2] sm:p-8 lg:grid-cols-[0.85fr_1.6fr] lg:gap-10 lg:p-10">
        {/* Left: heading */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Why Choose Us?
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#F4F4F2]/70">
            We provide reliable, affordable and hassle-free equipment rental for everyone.
          </p>
          <Link
            href="/about"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#7CB518] px-5 py-3 text-sm font-bold text-[#1B1F16] transition hover:bg-[#6aa00f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7CB518]"
          >
            Learn more <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>

        {/* Right: 4 equal cards */}
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 + i * 0.1 }}
              className="group flex h-full flex-col justify-center items-center rounded-2xl border border-[#F4F4F2]/10 bg-[#F4F4F2]/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-[#7CB518]/60 hover:bg-[#F4F4F2]/10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7CB518] text-[#1B1F16]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-sm font-bold sm:text-base">{title}</h3>
              <p className="mt-1 text-xs text-center leading-relaxed text-[#F4F4F2]/60 sm:text-sm">{text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}