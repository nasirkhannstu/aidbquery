import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/authOption";
import Features from "@/components/Home/Feature";
import PricingSection from "@/components/Home/PricingSection";
import Landing from "@/components/Home/Landing";
import SupportedFiles from "@/components/Home/SupportedFiles";
import { using_mode } from "@/lib/utils";
import UseCaseSection from "@/components/Home/UseCase";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      {/* NOTE: landing section */}
      <Landing />

      {/* Feature section */}
      <Features />

      {/* value proposition section */}
      <section className="bg-white">
        <div className="flex w-full flex-col items-center justify-center bg-white py-2 lg:py-5">
          <p className="text-md pb-1 font-light text-zinc-500 md:text-xl lg:mb-5">
            Feel free to upload these files.
          </p>
        </div>
        {/* NOTE: supported files */}
        <SupportedFiles />
      </section>

      {/* NOTE: use case section */}
      <UseCaseSection />

      {/* NOTE: pricing  section*/}
      {using_mode === "SaaS" && <PricingSection user={session?.user} />}
      {/* NOTE: Testimonial */}
    </>
  );
}
