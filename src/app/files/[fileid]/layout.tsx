import React, { PropsWithChildren } from "react";
import { Metadata } from "next";

import { db } from "@/db/prisma";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params: { fileid },
}: {
  params: { fileid: string };
}): Promise<Metadata> {
  const file = await db.files.findUnique({ where: { id: fileid } });

  if (!file) return notFound();

  return {
    title: file.name,
    description: file.texts || file.name,
  };
}

const FileLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return <>{children}</>;
};

export default FileLayout;
