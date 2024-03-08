import { Button } from "antd";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { getServerAuthSession } from "@/lib/authOptions";

export default async function Home() {
  const session = await getServerAuthSession();
  session?.user;

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return eq(fields.id, "1");
    },
  });

  console.log(user);

  return <Button type="primary">Click me</Button>;
}
