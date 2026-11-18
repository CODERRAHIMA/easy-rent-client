"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Equipment", href: "/all-equipment" },
    { label: "About us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "How it work", href: "/how-it-work" },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="relative z-50 bg-[#F4F4F3]">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
                <Link href="/" className="shrink-0" aria-label="Easy Rent home">
                    <Image
                        src="/logo.png"
                        alt="Easy Rent"
                        width={150}
                        height={50}
                        className="h-12 w-auto object-contain"
                        priority
                    />
                </Link>

                <div className="hidden items-center gap-6 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-slate-700 transition-colors hover:text-black"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden items-center gap-3 lg:flex">
                    <Link
                        href="/login"
                        className="inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-[#76B019] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#679b16]"
                    >
                        Register
                    </Link>
                </div>

                <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen((open) => !open)}
                >
                    {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </nav>

            {isMenuOpen && (
                <div className="absolute left-0 right-0 top-full border-t border-slate-100 bg-white px-4 pb-5 shadow-lg lg:hidden">
                    <div className="mx-auto flex max-w-7xl flex-col gap-1 pt-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-3 flex gap-3 border-t border-slate-100 pt-4">
                            <Link
                                href="/login"
                                className="inline-flex h-11 flex-1 items-center justify-center rounded-lg text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-[#76B019] text-sm font-semibold text-white transition-colors hover:bg-[#679b16]"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;