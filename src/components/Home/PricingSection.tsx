import PricingComponent from "@/components/PricingComponent";
import { LoginUser } from "@/types/nextauth";
import MaxWidthWrapper from "@/components/FixMaxWidth";

interface PricingSectionProps {
  user: LoginUser | undefined;
}

const PricingSection = ({ user }: PricingSectionProps) => {
  return (
    <section className="min-h-[calc(100vh-56px)] bg-white py-5" id="pricing">
      <MaxWidthWrapper className="mb-8 mt-24 flex max-w-5xl flex-col text-center">
        <p className="text-center text-xl font-extrabold text-primary drop-shadow-md">
          Pricing
        </p>
        <h2 className="py-3 text-center text-4xl font-extrabold drop-shadow-xl">
          Simple, Transparent Pricing
        </h2>
        <p className="mx-auto max-w-prose text-center text-lg font-light text-muted-foreground">
          Choose an affordable plan that’s packed with the best features for
          engaging your audience, creating customer loyalty, and driving sales.
        </p>

        <div className="container max-w-5xl text-center">
          <PricingComponent user={user} />
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default PricingSection;
