import { db } from "@/db";
import { getServerAuthSession } from "@/lib/authOptions";
import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadataGenerator = async ({
  params: { userId },
}: {
  params: { userId: string };
}): Promise<Metadata> => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!user) return notFound();

  return {
    title: user.fullName,
    description: `Profile of ${user.fullName} and bio: ${user.bio}`,
  };
};

const ProfileLayout = async ({
  params: { userId },
}: {
  params: { userId: string };
}) => {
  const session = await getServerAuthSession();

  if (session?.user.id !== userId) {
    return redirect("/chats");
  }

  return <div>ProfileLayout</div>;
};

export default ProfileLayout;
