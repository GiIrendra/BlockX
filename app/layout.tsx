import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BlockX",
  description: "A Next.js app for managing Web3 investments, NFTs, and DeFi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="A Next.js app for managing Web3 investments, NFTs, and DeFi." />
        <meta name="keywords" content="Web3, Blockchain, NFTs, DeFi, Investments" />
        <meta name="author" content="Girendra" />
        <meta property="og:title" content="BlockX" />
        <meta property="og:description" content="A Next.js app for managing Web3 investments, NFTs, and DeFi." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://block-x.netlify.app/" />
        <meta property="og:image" content="/images/social.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BlockX" />
        <meta name="twitter:description" content="A Next.js app for managing Web3 investments, NFTs, and DeFi." />
        <meta name="twitter:image" content="/images/tweet.jpg" />
        <link rel="icon" href="/images/favicon.ico" />
        </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
