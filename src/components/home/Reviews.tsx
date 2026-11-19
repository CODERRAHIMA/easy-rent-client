"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const reviews = [
  {
    name: "Daniel Doe",
    img: "/boyReview.avif",
    rented: "Excavator 20T",
    rating: 5,
    comment: "Booked in minutes and the machine arrived on time and in great shape. It saved us from buying one for a two-week job.",
  },
  {
    name: "Peter Pank",
    img: "/boyReview.avif",
    rented: "DSLR camera kit",
    rating: 5,
    comment: "I rented a full camera kit for a wedding shoot. The owner was helpful and the price was far lower than I expected.",
  },
  {
    name: "Marcus Lee",
    img: "/boyReview.avif",
    rented: "Compact tractor",
    rating: 4,
    comment: "Easy to find the right tractor and the weekly rate was fair. Payment through Stripe felt safe and quick.",
  },
  {
    name: "Sofia Alvarez",
    img: "/girlReview.jpg",
    rented: "Event lighting set",
    rating: 5,
    comment: "Our event lighting looked amazing. Everything was verified and the owner confirmed delivery the same day.",
  },
];

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= value ? "fill-[#7CB518] text-[#7CB518]" : "fill-transparent text-[#1B1F16]/25"}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const reduce = useReducedMotion();
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="bg-[#F4F4F2] text-[#1B1F16]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#3F6212]">Customer reviews</p>
            <h2 className="mt-3 max-w-lg text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Trusted by people who rent with us
            </h2>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#1B1F16]/10 bg-white px-5 py-4">
            <span className="text-4xl font-extrabold leading-none">{avg}</span>
            <div>
              <Stars value={Math.round(Number(avg))} />
              <p className="mt-1 text-xs font-medium text-[#1B1F16]/60">Average customer rating</p>
            </div>
          </div>
        </motion.div>

        {/* Cards */}
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <motion.li
              key={r.name}
              initial={{ opacity: 0, y: reduce ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.1 }}
              className="flex h-full flex-col rounded-3xl border border-[#1B1F16]/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7CB518] text-[#1B1F16]">
                <Quote className="h-5 w-5" aria-hidden />
              </span>

              <div className="mt-5">
                <Stars value={r.rating} />
              </div>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#1B1F16]/75">{r.comment}</p>

              {/* <div className="mt-6 flex items-center gap-3 border-t border-[#1B1F16]/10 pt-5">
                <Image src={r.img} alt="UserImg" width={50} height={50}/>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{r.name}</p>
                  <p className="truncate text-xs text-[#1B1F16]/60">Rented: {r.rented}</p>
                </div>
              </div> */}
              <div className="mt-6 flex items-center gap-3.5 border-t border-[#1B1F16]/10 pt-5">
  <div className="relative size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-[#7CB518]/25 ring-offset-2 ring-offset-white">
    <Image
      src={r.img}
      alt={r.name}
      fill
      sizes="44px"
      className="object-cover object-top"
    />
  </div>
  <div className="min-w-0">
    <p className="truncate text-sm font-bold text-[#1B1F16]">{r.name}</p>
    <p className="truncate text-xs text-[#1B1F16]/60">
      Rented: {r.rented}
    </p>
  </div>
</div>

            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}