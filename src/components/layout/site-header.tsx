"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, Phone, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";

import { CartButton } from "@/components/cart/cart-button";
import { FacebookIcon, InstagramIcon } from "@/components/icons/social-icons";
import { MAIN_NAV } from "@/lib/navigation";
import { SITE, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogoClick = () => {
    setOpen(false);
    if (pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
  };

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 8);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] bg-[#222222] text-white transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled &&
          "border-b border-white/10 bg-[#222222]/80 shadow-lg shadow-black/15 backdrop-blur-xl supports-[backdrop-filter]:bg-[#222222]/70",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5"
          onClick={handleLogoClick}
          aria-label="Turateks ana sayfa"
        >
          <Image
            src="/brand/logo-enhanced.png"
            alt="Turateks Yağmurluk"
            width={774}
            height={236}
            className="h-11 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {MAIN_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  active ? "text-primary" : "text-white/80",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/urunler"
            className="inline-flex size-10 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Ara"
          >
            <Search className="size-5" />
          </Link>
          <Link
            href="/hesap"
            className="inline-flex size-10 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Hesap"
          >
            <User className="size-5" />
          </Link>
          <CartButton />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg text-white md:hidden"
            aria-expanded={open}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-white/10 px-4 py-3 md:hidden">
          <ul className="flex flex-col">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-3 text-base text-white/90"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-white/10 pt-4 pb-2">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-white/50">
              Bize Ulaşın & Sosyal Medya
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7]"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-[#1877F2]"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex size-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-all"
              >
                <MessageCircle className="size-4" />
              </a>
              <a
                href={SITE.phoneHref}
                aria-label="Telefon"
                className="flex size-9 items-center justify-center rounded-full bg-primary text-white transition-all"
              >
                <Phone className="size-4" />
              </a>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
