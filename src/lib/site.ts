export const SITE = {
  name: "Turateks Yağmurluk",
  tagline: "Profesyonel yağmurluk üreticisi",
  phoneDisplay: "0531 379 73 14",
  phoneHref: "tel:+905313797314",
  email: "info@turateksyagmurluk.com",
  whatsapp: "905313797314",
  address: "Duaçınarı Mah. Yeşilova Cad. No: 28/1 Yıldırım / Bursa",
} as const;

export function whatsappHref(text?: string, phone: string = SITE.whatsapp) {
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${phone}${q}`;
}
