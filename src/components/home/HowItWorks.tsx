"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Search, CalendarCheck, CreditCard, PackageCheck,
  UserPlus, PlusSquare, BadgeCheck, Wallet, ArrowRight,
} from "lucide-react";

const flows = {
  customer: {
    label: "I want to rent",
    cta: { text: "Browse equipment", href: "/all-equipment" },
    steps: [
      { icon: Search, title: "Find equipment", text: "Search by name or location and filter by category, price and availability." },
      { icon: CalendarCheck, title: "Pick your dates", text: "Choose the rental period and quantity. The total price is calculated for you." },
      { icon: CreditCard, title: "Pay securely", text: "Check out with Stripe. Your booking is confirmed once payment is complete." },
      { icon: PackageCheck, title: "Receive and use it", text: "The owner delivers or hands over the equipment. Track everything in My Rentals." },
    ],
  },
  owner: {
    label: "I own equipment",
    cta: { text: "Become an owner", href: "/register" },
    steps: [
      { icon: UserPlus, title: "Create an account", text: "Sign up in a minute and set up your owner profile." },
      { icon: PlusSquare, title: "List your equipment", text: "Add photos, price, rental type, quantity and your rental terms." },
      { icon: BadgeCheck, title: "Get approved", text: "Our admins review your listing, then it goes live for customers." },
      { icon: Wallet, title: "Earn from bookings", text: "Accept rentals, hand over the gear and watch your earnings grow." },
    ],
  },
} as const;

type Key = keyof typeof flows;

export default function HowItWorks() {
  const [tab, setTab] = useState<Key>("customer");
  const reduce = useReducedMotion();
  const flow = flows[tab];

  return (
    <section id="how-it-works" className="scroll-mt-24 bg-white text-[#1B1F16]">
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
            <p className="text-sm font-bold uppercase tracking-widest text-[#3F6212]">How it works</p>
            <h2 className="mt-3 max-w-lg text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              From search to pickup in four steps
            </h2>
          </div>

          {/* Tabs */}
          <div role="tablist" aria-label="Choose a flow" className="inline-flex rounded-2xl bg-[#F4F4F2] p-1.5">
            {(Object.keys(flows) as Key[]).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3F6212] ${
                  tab === k ? "bg-[#1B1F16] text-[#F4F4F2]" : "text-[#1B1F16]/70 hover:text-[#1B1F16]"
                }`}
              >
                {flows[k].label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -16 }}
            transition={{ duration: 0.3 }}
            className="relative mt-14"
          >
            {/* Connector line (desktop) */}
            <div className="absolute left-[2.5rem] right-[2.5rem] top-7 hidden h-0.5 bg-[#1B1F16]/10 lg:block" aria-hidden>
              <motion.div
                initial={{ scaleX: reduce ? 1 : 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                className="h-full origin-left bg-[#7CB518]"
              />
            </div>

            <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {flow.steps.map(({ icon: Icon, title, text }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 + i * 0.12 }}
                  className="relative flex h-full flex-col"
                >
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7CB518] text-[#1B1F16] ring-8 ring-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#3F6212]">
                    Step 0{i + 1}
                  </p>
                  <h3 className="mt-1 text-xl font-extrabold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#1B1F16]/70">{text}</p>
                </motion.li>
              ))}
            </ol>

            <div className="mt-12">
              <Link
                href={flow.cta.href}
                className="inline-flex items-center gap-2 rounded-xl bg-[#7CB518] px-6 py-3.5 text-sm font-bold text-[#1B1F16] transition hover:bg-[#6aa00f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]"
              >
                {flow.cta.text} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}