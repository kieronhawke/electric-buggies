import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { WhatsAppButton } from "@/components/whatsapp-button";

/** Marketing chrome, wraps all public pages (the /studio route opts out). */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-[2px] focus:bg-ink focus:px-5 focus:py-3 focus:text-[.78rem] focus:font-semibold focus:uppercase focus:tracking-[.06em] focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  );
}
