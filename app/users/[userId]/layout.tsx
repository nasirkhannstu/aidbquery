import { db } from "@/db";
import { getServerAuthSession } from "@/lib/authOptions";
import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { type ReactNode } from "react";

export const generateMetadata = async ({
  params: { userId },
}: {
  params: { userId: string };
}): Promise<Metadata> => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!user) return notFound();

  return {
    title: `${user.firstName} ${user.lastName}`,
    description: `Profile of ${user.firstName} ${user.lastName} and bio: ${user.bio}`,
  };
};

const ProfileLayout = async ({
  children,
  params: { userId },
}: {
  children: ReactNode;
  params: { userId: string };
}) => {
  const session = await getServerAuthSession();

  if (session?.user.id !== userId) {
    return redirect("/chats");
  }

  return <>{children}</>;
};

export default ProfileLayout;
