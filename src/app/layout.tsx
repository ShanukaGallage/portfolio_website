import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shanuka Gallage | DevOps & Cloud Engineer",
  description:
    "Personal portfolio of Shanuka Gallage — DevOps, SRE, and Cloud Engineering student. Explore projects, skills, and experience in infrastructure automation, CI/CD, Kubernetes, and cloud platforms.",
  keywords: [
    "DevOps",
    "SRE",
    "Cloud Engineering",
    "Kubernetes",
    "Terraform",
    "CI/CD",
    "AWS",
    "Portfolio",
  ],
  authors: [{ name: "Shanuka Gallage" }],
  openGraph: {
    title: "Shanuka Gallage | DevOps & Cloud Engineer",
    description:
      "DevOps, SRE, and Cloud Engineering student. Infrastructure automation, CI/CD, Kubernetes, and cloud platforms.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import BootWrapper from "@/components/BootWrapper";
import TerminalOverlay from "@/components/TerminalOverlay";
import StatusBar from "@/components/StatusBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="scanline-overlay">
        <BootWrapper>
          <TerminalOverlay />
          <Navbar />
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 w-full pt-16 pb-8 overflow-x-hidden">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </div>
          <StatusBar />
        </BootWrapper>
      </body>
    </html>
  );
}
