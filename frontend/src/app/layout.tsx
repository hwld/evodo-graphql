import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "evodo-graphql",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={clsx(
          inter.className,
          "bg-neutral-100 bg-[url(/dots.svg)] bg-[length:200px] text-neutral-700",
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
