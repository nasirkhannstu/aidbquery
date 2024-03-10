import { getServerAuthSession } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";

const AuthLayout = async ({ children }: PropsWithChildren) => {
  const session = await getServerAuthSession();

  if (session) {
    return redirect("/chats");
  }

  return <>{children}</>;
};

export default AuthLayout;
