"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { useCartStore } from "@/lib/cart-store";

export function CartButton() {
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const shown = ready ? count : 0;

  return (
    <Link
      href="/sepet"
      className="relative inline-flex size-10 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
      aria-label="Sepet"
    >
      <ShoppingBag className="size-5" />
      {shown > 0 ? (
        <span className="absolute top-1 right-1 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] font-semibold text-white">
          {shown}
        </span>
      ) : null}
    </Link>
  );
}
