import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_NAME, DESCRIPTION } from "@/lib/utils";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--main-font",
});
export const metadata: Metadata = {
  title: {
    default: APP_NAME || "AIDBQuery",
    template: `%s - ${APP_NAME}`,
  },
  description: DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
