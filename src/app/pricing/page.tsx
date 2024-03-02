import { getServerSession } from "next-auth";

import MaxWidthWrapper from "@/components/FixMaxWidth";
import { authOptions } from "@/lib/auth/authOption";
import PricingComponent from "@/components/PricingComponent";

const PricingPage = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <>
      <MaxWidthWrapper className="mb-8 mt-24 max-w-5xl text-center">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            Whether you&apos;re just trying out our service or need more,
            we&apos;ve got you covered.
          </p>
        </div>

        {/* FIXME: include there */}
        <PricingComponent user={user} />
      </MaxWidthWrapper>
    </>
  );
};

export default PricingPage;
