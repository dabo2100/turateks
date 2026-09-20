"use client";

import { useState, useTransition } from "react";
import {
  Clock,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { submitContact } from "@/app/iletisim/actions";
import { FacebookIcon, InstagramIcon } from "@/components/icons/social-icons";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/settings";
import { SITE, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ContactSection({ settings }: { settings: SiteSettings }) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const contactCards = [
    {
      title: "Fabrika & Ofis",
      value: settings.address,
      icon: MapPin,
      iconBg: "bg-primary/10 text-primary",
      href: `https://maps.google.com/?q=${encodeURIComponent(settings.address)}`,
      isExternal: true,
    },
    {
      title: "Telefon",
      value: settings.phoneDisplay,
      icon: Phone,
      iconBg: "bg-amber-500/10 text-amber-600",
      href: settings.phoneHref,
    },
    {
      title: "Çalışma Saatleri",
      value: "Pzt - Cts: 08:30 - 18:30",
      icon: Clock,
      iconBg: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "E-posta",
      value: settings.email,
      icon: Mail,
      iconBg: "bg-emerald-500/10 text-emerald-600",
      href: `mailto:${settings.email}`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#111315]">
      {/* 1. Dark Hero Section (With Call and WhatsApp buttons) */}
      <section className="relative overflow-hidden bg-[#111315] text-white pt-28 sm:pt-32 lg:pt-36 pb-44 sm:pb-52 lg:pb-64">
        {/* Subtle radial ambient glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(circle at 50% 15%, rgba(245, 130, 32, 0.22) 0%, transparent 60%), radial-gradient(circle at 85% 30%, rgba(166, 94, 46, 0.15) 0%, transparent 50%)",
          }}
        />

        {/* Subtle dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Hero Content */}
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-bold tracking-wider text-primary uppercase shadow-xs backdrop-blur-xs">
            <Headphones className="size-3.5 text-primary" />
            <span>İletişim & Destek</span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-white">
            Bizimle İletişime Geçin
          </h1>

          <p className="mt-4 text-sm text-white/75 sm:text-base max-w-xl mx-auto leading-relaxed">
            20 yılı aşkın üretim tecrübemizle, toptan ve perakende yağmurluk talepleriniz,
            özel logo baskı ve kurumsal çözümler için her zaman yanınızdayız.
          </p>

          {/* Quick Action Buttons: Phone & WhatsApp */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <a
              href={settings.phoneHref}
              className="inline-flex items-center gap-2.5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm sm:text-base px-6 sm:px-7 py-3 shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <PhoneCall className="size-4" />
              <span>{settings.phoneDisplay}</span>
            </a>

            <a
              href={whatsappHref("Merhaba, yağmurluk modelleriniz ve kurumsal toptan sipariş hakkında bilgi almak istiyorum.", settings.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base px-6 sm:px-7 py-3 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <MessageCircle className="size-4.5 text-[#25D366]" />
              <span>WhatsApp&apos;tan Yazın</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Middle Section with Angled White Background Plate (Top edge kept exactly as before) */}
      <section className="relative z-10 -mt-24 sm:-mt-32 lg:-mt-40">
        {/* Angled White Plate - clean sharp slant upwards to the right */}
        <div
          className="absolute inset-0 pointer-events-none bg-white [clip-path:polygon(0_60px,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(0_120px,100%_0,100%_100%,0_100%)]"
        />

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 sm:pt-12 lg:pt-14 pb-16 sm:pb-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Floating Message Form Card */}
            <div className="lg:col-span-6 xl:col-span-6">
              <div className="rounded-3xl border border-border/90 bg-white p-6 sm:p-8 lg:p-9 shadow-2xl shadow-black/10">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-charcoal sm:text-2xl">
                    Mesajınızı Bırakın
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    Aşağıdaki formu doldurun, ekibimiz en kısa sürede size geri dönüş sağlasın.
                  </p>
                </div>

                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.currentTarget);
                    startTransition(async () => {
                      const result = await submitContact(data);
                      if (!result.ok) {
                        toast.error(result.error);
                        return;
                      }
                      setSent(true);
                      toast.success("Mesajınız başarıyla alındı. En kısa sürede dönüş yapacağız.");
                      e.currentTarget.reset();
                    });
                  }}
                >
                  {/* Honeypot field */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

                  {/* Name & Email (2 columns) */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1.5">
                        Ad Soyad
                      </label>
                      <input
                        name="name"
                        required
                        placeholder="Adınız Soyadınız"
                        className="w-full rounded-xl border border-border bg-[#f8f9fa] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:bg-white focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1.5">
                        E-posta
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="ornek@sirket.com"
                        className="w-full rounded-xl border border-border bg-[#f8f9fa] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:bg-white focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Subject & Phone (2 columns) */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1.5">
                        Konu
                      </label>
                      <input
                        name="subject"
                        placeholder="Örn: Toptan Sipariş Fiyat Talebi"
                        className="w-full rounded-xl border border-border bg-[#f8f9fa] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:bg-white focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1.5">
                        Telefon
                      </label>
                      <input
                        name="phone"
                        placeholder="05XX XXX XX XX"
                        className="w-full rounded-xl border border-border bg-[#f8f9fa] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:bg-white focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5">
                      Mesajınız
                    </label>
                    <textarea
                      name="message"
                      required
                      minLength={10}
                      rows={4}
                      placeholder="Talebinizi, ilgilendiğiniz modelleri veya adet detaylarını buraya yazabilirsiniz..."
                      className="w-full rounded-xl border border-border bg-[#f8f9fa] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:bg-white focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 resize-y"
                    />
                  </div>

                  {/* Privacy check & Submit Button */}
                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required
                        className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span>Gizlilik politikasını ve KVKK şartlarını kabul ediyorum.</span>
                    </label>

                    <Button
                      type="submit"
                      disabled={pending || sent}
                      className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold px-7 py-3 text-sm shadow-md shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
                    >
                      {pending ? (
                        "Gönderiliyor…"
                      ) : sent ? (
                        "Gönderildi ✓"
                      ) : (
                        <>
                          <span>Mesajı Gönder</span>
                          <Send className="ml-1.5 size-3.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: "Don't hesitate to contact us" & 4 Info Cards */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between space-y-7 pt-2 lg:pt-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-charcoal sm:text-3xl lg:text-4xl">
                  Bizimle İletişime Geçmekten Çekinmeyin
                </h2>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Ürünlerimiz, toptan fiyatlandırma, kurumsal numune gönderimi ve imalat süreçlerimiz hakkında bilgi almak için bize dilediğiniz kanaldan ulaşabilirsiniz.
                </p>
              </div>

              {/* 4 Cards Grid (2x2) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {contactCards.map((c) => {
                  const Icon = c.icon;
                  const content = (
                    <div className="h-full flex items-start gap-3.5 rounded-2xl border border-border/80 bg-[#f8f9fa] p-4 sm:p-5 shadow-xs transition-all hover:bg-white hover:border-primary/50 hover:shadow-md">
                      <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", c.iconBg)}>
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-charcoal uppercase tracking-wide">{c.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground break-words leading-relaxed">
                          {c.value}
                        </p>
                      </div>
                    </div>
                  );

                  if (c.href) {
                    return (
                      <a
                        key={c.title}
                        href={c.href}
                        target={c.isExternal ? "_blank" : undefined}
                        rel={c.isExternal ? "noreferrer" : undefined}
                        className="block transition-transform hover:-translate-y-0.5"
                      >
                        {content}
                      </a>
                    );
                  }

                  return <div key={c.title}>{content}</div>;
                })}
              </div>

              {/* Social Media Row */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  Sosyal Medya :
                </span>
                <div className="flex items-center gap-2.5">
                  {/* Instagram */}
                  <a
                    href={settings.instagram || SITE.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex size-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-xs transition-transform hover:scale-110 active:scale-95"
                  >
                    <InstagramIcon className="size-5" />
                  </a>

                  {/* Facebook */}
                  <a
                    href={settings.facebook || SITE.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex size-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-xs transition-transform hover:scale-110 active:scale-95"
                  >
                    <FacebookIcon className="size-5" />
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={whatsappHref(undefined, settings.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="flex size-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs transition-transform hover:scale-110 active:scale-95"
                  >
                    <MessageCircle className="size-5" />
                  </a>

                  {/* Direct Phone */}
                  <a
                    href={settings.phoneHref}
                    aria-label="Telefon ile Ara"
                    className="flex size-10 items-center justify-center rounded-full bg-primary text-white shadow-xs transition-transform hover:scale-110 active:scale-95"
                  >
                    <PhoneCall className="size-4.5" />
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${settings.email}`}
                    aria-label="E-posta Gönder"
                    className="flex size-10 items-center justify-center rounded-full bg-charcoal text-white shadow-xs transition-transform hover:scale-110 active:scale-95"
                  >
                    <Mail className="size-4.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width Google Map Preview inside the container */}
          <div className="mt-10 sm:mt-14 overflow-hidden rounded-3xl border border-border/80 bg-white shadow-xl shadow-black/5">
            <iframe
              title="Turateks Konum"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&z=15&output=embed`}
              className="h-64 sm:h-80 lg:h-96 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* BOTTOM SLANTED DIVIDER: RIGHT HIGHER (y=15), LEFT LOWER (y=80) - SEAMLESS & CRISP */}
      <div className="relative w-full overflow-hidden leading-none bg-white">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-18 lg:h-24 block"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Elegant gradient line: fades to 0% opacity at screen edges to avoid cutoffs, shines in center */}
            <linearGradient id="dividerEdgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f58220" stopOpacity="0" />
              <stop offset="25%" stopColor="#f58220" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#ffa857" stopOpacity="1" />
              <stop offset="75%" stopColor="#f58220" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f58220" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Dark Polygon: Extends cleanly past boundaries (-10 to 1450, down to 105) to eliminate any edge gaps */}
          <path d="M-10,80 L1450,15 L1450,105 L-10,105 Z" fill="#111315" />

          {/* Crisp Gradient Line along the slant */}
          <line
            x1="-10"
            y1="80"
            x2="1450"
            y2="15"
            stroke="url(#dividerEdgeGrad)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* 3. Bottom CTA Section with CIRCULAR GLOW DIRECTLY BEHIND THE TEXT ONLY */}
      <section className="relative overflow-hidden bg-[#111315] text-white pt-6 pb-20 sm:pt-10 sm:pb-28">
        {/* Circular Radial Glow directly behind the text only (edges left clean and dark) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[320px] sm:size-[450px] lg:size-[560px] rounded-full blur-3xl opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(245, 130, 32, 0.4) 0%, rgba(245, 130, 32, 0.15) 45%, transparent 70%)",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-semibold text-white/90">
            <Sparkles className="size-3.5 text-primary" />
            <span>7/24 Kesintisiz Hizmet</span>
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl text-white max-w-2xl mx-auto">
            Aklınızda Bir Proje veya Toptan Sipariş mi Var? Konuşalım
          </h2>

          <p className="mt-3 text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
            Kurumsal yağmurluk ihtiyaçlarınız, toptan kademeli fiyat avantajları ve özel logo baskılı üretim için ekibimiz hemen yanıt versin.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={settings.phoneHref}
              className="inline-flex items-center gap-2.5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm sm:text-base px-8 py-3.5 shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <PhoneCall className="size-4.5" />
              <span>{settings.phoneDisplay}</span>
            </a>

            <a
              href={whatsappHref("Merhaba, toptan yağmurluk ve kurumsal sipariş hakkında bilgi almak istiyorum.", settings.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base px-7 py-3.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="size-4.5 text-[#25D366]" />
              <span>WhatsApp&apos;tan Yazın</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
