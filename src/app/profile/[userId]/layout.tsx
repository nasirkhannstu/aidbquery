import { db } from "@/db/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { PropsWithChildren } from "react";

type Props = {
  params: { userId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const userId = params.userId;

  const user = await db.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return notFound();

  return {
    title: user.name,
    description: `id:${user.id} ${user.name}'s profile page`,
  };
}

const ProfileLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default ProfileLayout;
