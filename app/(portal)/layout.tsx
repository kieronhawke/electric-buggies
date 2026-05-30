import type { Metadata } from "next";

// The portal is private: never index account/auth pages.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-paper text-ink">{children}</div>;
}
