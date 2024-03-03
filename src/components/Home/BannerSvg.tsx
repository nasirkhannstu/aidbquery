import React from "react";
import Image from "next/image";

import banner from "@/public/images/banner2.svg";

export const BannerSvg = () => {
  return <Image src={banner} alt="Banner" />;
};
