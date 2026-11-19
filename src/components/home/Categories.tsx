"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUpVariants, staggerVariants } from "../utils/animation";
import {
  AudioLines,
  ChevronLeft,
  ChevronRight,
  Construction,
  Drill,
  PartyPopper,
  SprayCan,
  Tractor,
} from "lucide-react";

const categories = [
  {
    name: "Agriculture Equipment",
    slug: "agriculture-equipment",
    description: "Tractors, harvesters, and more",
    itemCount: 12,
    icon: Tractor,
    iconColor: "text-[#557A24]",
    iconBackground: "bg-[#EEF4E5]",
  },
  {
    name: "Construction Equipment",
    slug: "construction-equipment",
    description: "Heavy machinery and excavators",
    itemCount: 24,
    icon: Construction,
    iconColor: "text-[#A36B22]",
    iconBackground: "bg-[#F8F0E4]",
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "Audio, monitors, and essentials",
    itemCount: 16,
    icon: AudioLines,
    iconColor: "text-[#5966A3]",
    iconBackground: "bg-[#EEF0FA]",
  },
  {
    name: "Event Equipment",
    slug: "event-equipment",
    description: "Stages, sound, and outdoor gear",
    itemCount: 10,
    icon: PartyPopper,
    iconColor: "text-[#A45768]",
    iconBackground: "bg-[#F8ECEF]",
  },
  {
    name: "Power Tools",
    slug: "power-tools",
    description: "Drills, saws, and workshop tools",
    itemCount: 18,
    icon: Drill,
    iconColor: "text-[#6B6757]",
    iconBackground: "bg-[#F1F0EA]",
  },
  {
    name: "Cleaning Equipment",
    slug: "cleaning-equipment",
    description: "Pressure washers and floor care",
    itemCount: 8,
    icon: SprayCan,
    iconColor: "text-[#47736B]",
    iconBackground: "bg-[#EAF3F1]",
  },
];

const Categories = () => {
  const reduceMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const cardVariants = fadeUpVariants(reduceMotion, 16, 0.4);
  const cardListVariants = staggerVariants(reduceMotion, 0.08);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = 320;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="mt-8 bg-[#E9E8E8] px-5 py-16 sm:py-20"
      aria-labelledby="popular-categories-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header & Navigation Buttons */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-12 sm:flex-row sm:items-end">
          <motion.div
            variants={fadeUpVariants(reduceMotion, 14)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#557A24]">
              Find the right fit
            </p>
            <h2
              id="popular-categories-heading"
              className="text-4xl font-extrabold tracking-tight text-[#1B1F16] sm:text-5xl"
            >
              Popular Categories
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#1B1F16]/65 sm:text-base">
              Explore equipment for every project, all in one place.
            </p>
          </motion.div>

          {/* Left & Right Arrow Buttons */}
          <div className="flex items-center gap-2.5 self-start sm:self-end">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll categories left"
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-[#1B1F16]/10 bg-white text-[#1B1F16] shadow-sm transition-all duration-200 hover:border-[#7CB518] hover:bg-[#7CB518] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#1B1F16]/10 disabled:hover:bg-white disabled:hover:text-[#1B1F16]"
            >
              <ChevronLeft className="size-5" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll categories right"
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-[#1B1F16]/10 bg-white text-[#1B1F16] shadow-sm transition-all duration-200 hover:border-[#7CB518] hover:bg-[#7CB518] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#1B1F16]/10 disabled:hover:bg-white disabled:hover:text-[#1B1F16]"
            >
              <ChevronRight className="size-5" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Cards Container */}
        <motion.div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          variants={cardListVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map(
            ({
              name,
              slug,
              description,
              itemCount,
              icon: Icon,
              iconColor,
              iconBackground,
            }) => (
              <motion.div
                key={slug}
                variants={cardVariants}
                className="w-[240px] shrink-0 snap-start sm:w-[243px]"
              >
                <Link
                  href={`/category/${slug}`}
                  className="group flex min-h-44 w-full flex-col gap-5 rounded-2xl border border-[#1B1F16]/[0.08] bg-white p-5 shadow-[0_2px_8px_rgba(27,31,22,0.04)] transition duration-200 hover:-translate-y-1 hover:border-[#7CB518]/50 hover:shadow-[0_12px_28px_rgba(27,31,22,0.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#557A24] sm:p-6"
                >
                  <div className="flex justify-between">
                    <span
                      className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${iconBackground} ${iconColor} transition-transform duration-200 group-hover:scale-105`}
                      aria-hidden="true"
                    >
                      <Icon className="size-8" strokeWidth={1.7} />
                    </span>
                    <span
                      className="text-xl text-[#1B1F16]/30 transition-all group-hover:translate-x-1 group-hover:text-[#557A24]"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-[#1B1F16] transition-colors group-hover:text-[#557A24]">
                      {name}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-[#1B1F16]/60">
                      {description}
                    </span>
                    <span className="mt-3 inline-flex rounded-full bg-[#F4F4F2] px-3 py-1 text-xs font-semibold text-[#557A24]">
                      {itemCount} items
                    </span>
                  </span>
                </Link>
              </motion.div>
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
