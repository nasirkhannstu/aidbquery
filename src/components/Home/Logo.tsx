import React from "react";
import Link from "next/link";
import { app_name } from "@/lib/utils";

const Logo = () => {
  return (
    <Link href="/" className="text-xl font-bold text-primary">
      {app_name}
    </Link>
  );
};

export default Logo;
