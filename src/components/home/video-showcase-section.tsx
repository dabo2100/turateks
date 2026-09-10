"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play, Pause, Volume2, VolumeX, ShieldCheck, Factory, Sparkles, ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOTION_EASE, STATS } from "./motion-presets";
import { StatCounterCard } from "./stat-counter";
import { ScrollReveal } from "./scroll-reveal";

const VIDEO_SLIDES = [
  {
    src: "/brand/hero/hero-1.mp4",
    title: "Üretim Hattı ve Fabrika",
    desc: "Bursa'daki tesislerimizde yüksek frekans kaynak teknolojisiyle sıfır sızıntı garantisi.",
    badge: "Bursa Fabrikası",
  },
  {
    src: "/brand/hero/hero-2.mp4",
    title: "Sahada Profesyonel Koruma",
    desc: "Balıkçı, kurye, denizci ve inşaat ekipleri için en zorlu iklimde test edilmiş dayanıklılık.",
    badge: "Saha Testleri",
  },
] as const;

export function VideoShowcaseSection() {
  const reduced = useReducedMotion();
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const switchVideo = useCallback((idx: number) => {
    setActiveVideo(idx);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeVideo) {
        if (isPlaying && !reduced) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeVideo, isPlaying, reduced]);

  const togglePlay = () => {
    const currentVid = videoRefs.current[activeVideo];
    if (!currentVid) return;
    if (isPlaying) {
      currentVid.pause();
      setIsPlaying(false);
    } else {
      void currentVid.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const currentVid = videoRefs.current[activeVideo];
    if (!currentVid) return;
    currentVid.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative overflow-hidden bg-[#161616] py-16 text-white sm:py-20 lg:py-24" aria-label="Üretim ve Kalite">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -left-40 top-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <Factory className="size-3.5" />
                Yerli Üretim Gücü & Standartlar
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                1987&apos;den Beri Kesintisiz Kalite
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                Fabrikamızdaki modern hatlarda, yüksek frekanslı yapıştırma teknolojisiyle üretilen profesyonel yağmurluklarımızı yakından görün.
              </p>
            </div>

            {/* Video Selector Buttons */}
            <div className="flex rounded-lg border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
              {VIDEO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => switchVideo(idx)}
                  className={cn(
                    "rounded-md px-3.5 py-1.5 text-xs font-medium transition-all sm:text-sm",
                    activeVideo === idx
                      ? "bg-primary text-white shadow-md"
                      : "text-white/70 hover:text-white hover:bg-white/10",
                  )}
                >
                  {slide.badge}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Video Display Box */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/15 bg-black/60 shadow-2xl shadow-black/50">
          <div className="relative aspect-[16/9] w-full max-h-[580px] overflow-hidden bg-black">
            {VIDEO_SLIDES.map((slide, idx) => (
              <video
                key={slide.src}
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                src={slide.src}
                className={cn(
                  "absolute inset-0 size-full object-cover transition-opacity duration-700",
                  idx === activeVideo ? "opacity-100" : "pointer-events-none opacity-0",
                )}
                muted={isMuted}
                loop
                playsInline
                autoPlay={idx === 0 && !reduced}
                preload="metadata"
                aria-label={slide.title}
              />
            ))}

            {/* Ambient gradients */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Video Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 sm:p-7">
              <div className="max-w-lg">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-primary backdrop-blur-sm">
                  <Sparkles className="size-3" />
                  {VIDEO_SLIDES[activeVideo].badge}
                </span>
                <h3 className="mt-2 text-lg font-bold sm:text-xl md:text-2xl">
                  {VIDEO_SLIDES[activeVideo].title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/80 sm:text-sm">
                  {VIDEO_SLIDES[activeVideo].desc}
                </p>
              </div>

              {/* Video Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-primary hover:border-primary sm:size-10"
                  aria-label={isPlaying ? "Videoyu duraklat" : "Videoyu oynat"}
                >
                  {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-current ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-primary hover:border-primary sm:size-10"
                  aria-label={isMuted ? "Sesi aç" : "Sesi kapat"}
                >
                  {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid and CTA Banner */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
            {STATS.map((stat, statIndex) => (
              <StatCounterCard key={stat.label} stat={stat} index={statIndex} />
            ))}
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm sm:flex-row sm:items-center lg:flex-col lg:items-start lg:gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                <ShieldCheck className="size-4" />
                Fabrikadan Doğrudan Satış
              </p>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                Toplu siparişlerde özel logo baskısı ve kademeli toptan indirim avantajı.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-0 lg:mt-0">
              <Link
                href="/toptan"
                className={cn(buttonVariants({ size: "default" }), "gap-1.5 bg-primary text-white hover:bg-primary/90")}
              >
                Toptan Teklif Al
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/urunler"
                className={cn(
                  buttonVariants({ size: "default", variant: "outline" }),
                  "border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white",
                )}
              >
                Kataloğu Gör
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
