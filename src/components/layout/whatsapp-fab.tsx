import { SITE, whatsappHref } from "@/lib/site";

export function WhatsappFab({ phone = SITE.whatsapp }: { phone?: string }) {
  return (
    <a
      href={whatsappHref("Merhaba, ürünleriniz hakkında bilgi almak istiyorum.", phone)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-50 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
      aria-label="WhatsApp ile yazın"
    >
      <svg viewBox="0 0 24 24" className="size-7 fill-current" aria-hidden>
        <path d="M20.5 3.5A11 11 0 0 0 2.1 16.7L1 23l5.4-1.1A11 11 0 1 0 20.5 3.5zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-2.6.5.5-2.5-.2-.3A9.1 9.1 0 1 1 12 20.5zm5-6.8c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1.1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.5-.6.1-.2a.5.5 0 0 0 0-.5l-.9-2.1c-.2-.5-.5-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4.1 5.5 5.5 0 0 0 3.4.8 2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c0-.2-.2-.2-.4-.3z" />
      </svg>
    </a>
  );
}
