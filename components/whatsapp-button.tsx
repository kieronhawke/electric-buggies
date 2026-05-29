"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Floating WhatsApp concierge button. Uses the configured WhatsApp number
 * (placeholder is the UK reserved-fiction range until the owner sets a real
 * mobile). On mobile it sits low while reading and lifts clear of the sticky
 * action bar once that appears (same scroll threshold as MobileCtaBar).
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  // The configurator has its own tall sticky total/quote bar, so a floating
  // chat button there is redundant and would clip it; hide it on that route.
  const onConfigurator = pathname.startsWith("/configure");
  // Model detail pages keep a persistent enquire bar; lift the FAB clear of it.
  const hasBottomBar = /^\/range\/[^/]+$/.test(pathname) && pathname !== "/range";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const raised = scrolled || hasBottomBar;

  const num = site.contact.whatsapp.replace(/[^\d]/g, "");
  if (!num || onConfigurator) return null;
  const msg = encodeURIComponent("Hello, I'd like to enquire about an electric buggy.");
  return (
    <a
      href={`https://wa.me/${num}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={cn(
        "fixed right-4 z-[90] flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.4)] transition-[transform,bottom] duration-300 hover:scale-105 [height:3.25rem] [width:3.25rem] lg:bottom-6",
        // mobile: clear the sticky action bar (appears past 600px) + safe-area
        raised ? "bottom-[calc(5.5rem+env(safe-area-inset-bottom))]" : "bottom-[calc(1.25rem+env(safe-area-inset-bottom))]",
      )}
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.1 1.6 5.9L4 29l8.3-1.6c1.7.9 3.6 1.4 5.7 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.9 1 1-4.8-.2-.4c-1-1.6-1.5-3.4-1.5-5.3C5 9.5 9.9 5 16 5s11 4.5 11 10-4.9 9.8-11 9.8zm5.6-7.3c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z" />
      </svg>
    </a>
  );
}
