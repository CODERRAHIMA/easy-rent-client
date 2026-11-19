import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/all-equipment" },
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "/contact" },
  { label: "How it works", href: "/#how-it-works" },
];

const socials = [
  { label: "X", href: "https://x.com", icon: FaXTwitter },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
];

const contact = [
  {
    icon: Mail,
    text: "support@easyrent.com",
    href: "mailto:support@easyrent.com",
  },
  { icon: Phone, text: "+1 234 567 890", href: "tel:+1234567890" },
  { icon: MapPin, text: "123 Rental Street, USA", href: undefined },
];

export default function Footer() {
  return (
    <footer className="bg-[#1B1F16] text-[#F4F4F2]">
      <div className="h-1 bg-[#7CB518]" aria-hidden />

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.1fr] lg:gap-16 lg:py-16">
        {/* Brand */}
        <div>
          <Link href="/" aria-label="EasyRent home" className="inline-block">
            <Image
              src="/logo.png"
              alt="EasyRent"
              width={160}
              height={44}
              className="h-15 w-auto brightness-0 invert"
            />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#F4F4F2]/70">
            EasyRent connects people with trusted equipment owners. Find, book
            and pay for the gear you need, from construction machines to
            cameras, in a few clicks.
          </p>

          <ul className="mt-6 flex gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F4F4F2]/20 text-[#F4F4F2] transition hover:border-[#7CB518] hover:bg-[#7CB518] hover:text-[#1B1F16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7CB518]"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#7CB518]">
            Quick links
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-[#F4F4F2]/70 transition hover:text-[#7CB518]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#7CB518]">
            Contact us
          </h3>
          <ul className="mt-5 space-y-4 text-sm">
            {contact.map(({ icon: Icon, text, href }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4F4F2]/10 text-[#7CB518]">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                {href ? (
                  <a
                    href={href}
                    className="pt-1 text-[#F4F4F2]/70 transition hover:text-[#7CB518]"
                  >
                    {text}
                  </a>
                ) : (
                  <span className="pt-1 text-[#F4F4F2]/70">{text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#F4F4F2]/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-[#F4F4F2]/60 sm:flex-row sm:px-8 sm:text-sm">
          <p>© 2026 EasyRent. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="transition-colors hover:text-[#7CB518]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/"
              className="transition-colors hover:text-[#7CB518]"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
