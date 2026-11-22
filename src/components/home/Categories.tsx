"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUpVariants, staggerVariants } from "../utils/animation";
import {
  AudioLines,
  Construction,
  Drill,
  PartyPopper,
  Tractor,
} from "lucide-react";

const categories = [
  {
    name: "Agriculture Equipment",
    slug: "agriculture-equipment",
    shortDescription: "Tractors, harvesters, and many more",
    itemCount: 12,
    icon: Tractor,
    iconColor: "text-[#557A24]",
    iconBackground: "bg-[#EEF4E5]",
  },
  {
    name: "Construction Equipment",
    slug: "construction-equipment",
    shortDescription: "Heavy machinery and excavators",
    itemCount: 24,
    icon: Construction,
    iconColor: "text-[#A36B22]",
    iconBackground: "bg-[#F8F0E4]",
  },
  {
    name: "Electronics",
    slug: "electronics",
    shortDescription: "Audio, monitors, and essentials",
    itemCount: 16,
    icon: AudioLines,
    iconColor: "text-[#5966A3]",
    iconBackground: "bg-[#EEF0FA]",
  },
  {
    name: "Event Equipment",
    slug: "event-equipment",
    shortDescription: "Stages, sound, and outdoor gear",
    itemCount: 10,
    icon: PartyPopper,
    iconColor: "text-[#A45768]",
    iconBackground: "bg-[#F8ECEF]",
  },
  {
    name: "Power Tools",
    slug: "power-tools",
    shortDescription: "Drills, saws, and workshop tools",
    itemCount: 18,
    icon: Drill,
    iconColor: "text-[#6B6757]",
    iconBackground: "bg-[#F1F0EA]",
  },
];

const Categories = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="mt-8 bg-[#E9E8E8] px-5 py-16 sm:py-20"
      aria-labelledby="popular-categories-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
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
              className="text-3xl font-extrabold tracking-tight text-[#1B1F16] sm:text-5xl"
            >
              Popular Categories
            </h2>
            <p className="mt-3 max-w-xl text-xs leading-6 text-[#1B1F16]/65 sm:text-base">
              Explore equipment for every project, all in one place.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={staggerVariants(reduceMotion, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map(
            ({
              name,
              slug,
              shortDescription,
              itemCount,
              icon: Icon,
              iconColor,
              iconBackground,
            }) => (
              <motion.div
                key={slug}
                variants={fadeUpVariants(reduceMotion, 20, 0.45)}
                className="w-[240px] shrink-0 snap-start sm:w-[243px]"
              >
                <article className="flex min-h-44 w-full flex-col gap-5 rounded-2xl border border-[#1B1F16]/[0.08] bg-white p-5 shadow-[0_2px_8px_rgba(27,31,22,0.04)] sm:p-6">
                  <span
                    className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${iconBackground} ${iconColor}`}
                    aria-hidden="true"
                  >
                    <Icon className="size-8" strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-[#1B1F16]">
                      {name}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-[#1B1F16]/60">
                      {shortDescription}
                    </span>
                    <span className="mt-3 inline-flex rounded-full bg-[#F4F4F2] px-3 py-1 text-xs font-semibold text-[#557A24]">
                      {itemCount} items
                    </span>
                  </span>
                </article>
              </motion.div>
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
