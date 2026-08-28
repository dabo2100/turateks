"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PriceTier } from "@/lib/mock-catalog";

export type CartLine = {
  slug: string;
  name: string;
  sku: string;
  qty: number;
  color?: string;
  size?: string;
  imageUrl?: string;
  tiers: PriceTier[];
};

type CartState = {
  items: CartLine[];
  addItem: (line: CartLine) => void;
  setQty: (index: number, qty: number) => void;
  removeItem: (index: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (line) => {
        const items = [...get().items];
        const i = items.findIndex(
          (x) => x.slug === line.slug && x.color === line.color && x.size === line.size,
        );
        if (i >= 0) {
          items[i] = { ...items[i], qty: items[i].qty + line.qty };
        } else {
          items.push(line);
        }
        set({ items });
      },
      setQty: (index, qty) => {
        const items = [...get().items];
        if (!items[index]) return;
        if (qty < 1) {
          items.splice(index, 1);
        } else {
          items[index] = { ...items[index], qty };
        }
        set({ items });
      },
      removeItem: (index) => {
        set({ items: get().items.filter((_, i) => i !== index) });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "turateks-cart" },
  ),
);
