import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Botana – TikTok Playlist Companion",
  description: "Build and play TikTok video playlists with ease.",
  applicationName: "Botana",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Botana – TikTok Playlist Companion",
    description: "Build and play TikTok video playlists with ease.",
    url: "/",
    siteName: "Botana",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Botana – TikTok Playlist Companion",
    description: "Build and play TikTok video playlists with ease.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}> 
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 container mx-auto max-w-screen-2xl">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
