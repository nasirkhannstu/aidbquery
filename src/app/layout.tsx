/* eslint-disable indent */
import React, { PropsWithChildren } from "react";
import { Inter } from "next/font/google";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import fs from "fs";

import "./globals.css";
import CommonNavbar from "@/components/Navbar/CommonNavbar";
import Providers from "@/components/Providers";
import { TAG_LINE, absURL, app_name, cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import { authOptions } from "@/lib/auth/authOption";

export const metadata: Metadata = {
  metadataBase: absURL("/") as unknown as URL,
  title: {
    default: `${app_name} - ${TAG_LINE}`,
    template: `%s - ${app_name}`,
  },
  description: `Transform your document experience with our ${app_name}. Users upload files, pose questions, and receiveAI-generated answers tailored to their content. Seamlessly enhance document understanding, streamlining information retrieval. Unlock the power of intelligent insights and elevate your interaction with documents like never before. Try it now`,
  openGraph: {
    images: ["./opengraph-image.png"],
  },
  applicationName: app_name,
  keywords: [
    app_name,
    "documents",
    "understanding",
    "ai",
    "nlp",
    "openai",
    "namespaceit",
    "chatbot",
    "chatgpt",
  ],
  authors: [
    {
      name: app_name,
    },
    { name: "namespaceit", url: "https://namespaceit.com" },
  ],
  creator: "https://namespaceit.com",
  publisher: "https://namespaceit.com",
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const imgBase64 =
    user && user.avatar
      ? fs.readFileSync("public/uploads/avatars/" + user?.avatar, {
          encoding: "base64",
        })
      : undefined;

  return (
    <html lang="en" className="light scroll-smooth">
      <Providers>
        <body
          className={cn(
            "grainy min-h-screen font-sans antialiased",
            inter.className,
          )}
        >
          <Toaster />
          <CommonNavbar user={user} avatarBase64={imgBase64} />
          {children}
          <Footer />
        </body>
      </Providers>
    </html>
  );
}
