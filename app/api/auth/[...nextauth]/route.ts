import { authOptions } from "@/lib/authOptions";
import nextAuth from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = nextAuth(authOptions);

export { handler as GET, handler as POST };
