"use client"; // Ensure this is a Client Component
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import Image from "next/image"; // Import the Image component

const reviews = [
  {
    name: "Ethereum",
    username: "@ethereum",
    body: "The world's leading smart contract platform. Powering decentralized applications (dApps) and DeFi.",
    img: "/images/ethereum.png",
  },
  {
    name: "Binance",
    username: "@binance",
    body: "A leading blockchain ecosystem and cryptocurrency exchange. Known for its fast and low-cost transactions.",
    img: "/images/binance.png",
  },
  {
    name: "Polygon",
    username: "@polygon",
    body: "A Layer 2 scaling solution for Ethereum, enabling faster and cheaper transactions.",
    img: "/images/polygon.jpeg",
  },
  {
    name: "Solana",
    username: "@solana",
    body: "A high-performance blockchain supporting decentralized apps and crypto-currencies at lightning speed.",
    img: "/images/solana.png",
  },
  {
    name: "Avalanche",
    username: "@avalanche",
    body: "A highly scalable blockchain platform for decentralized applications and custom blockchain networks.",
    img: "/images/avalanche.png",
  },
  {
    name: "Linea",
    username: "@linea",
    body: "A next-generation blockchain platform focused on scalability and interoperability.",
    img: "/images/linea.jpeg", // Ensure the file extension matches
  },
  {
    name: "Bitcoin",
    username: "@bitcoin",
    body: "The first and most well-known cryptocurrency. A decentralized digital currency without a central bank.",
    img: "/images/bitcoin.png",
  },
];

const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {/* Replace <img> with <Image /> */}
        <Image
          className="rounded-full"
          width={32}
          height={32}
          alt={name}
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function MarqueeDemo() {
  return (
    <div className="relative flex h-[40vh] mt-[18vh] mb-2 w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}