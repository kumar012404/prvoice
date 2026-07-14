import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "BioLink Pro – Premium Link in Bio",
  description:
    "Share your world with one link. BioLink Pro is the premium mobile-first link in bio platform.",
  keywords: "link in bio, biolink, linktree alternative, social media links",
  openGraph: {
    title: "BioLink Pro",
    description: "Your premium link in bio",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ background: "#0B0F19", color: "#F9FAFB" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
