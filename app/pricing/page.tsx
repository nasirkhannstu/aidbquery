import { FaCheck, FaMinus } from "react-icons/fa6";
import { RxRocket } from "react-icons/rx";
import { Button, Divider, Popover, Space } from "antd";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { BsDiamondHalf } from "react-icons/bs";

import { freePlan, premiumPlan } from "@/config";
import UpgradeButton from "@/components/UpgradeButton";

const PricingPage = () => {
  return (
    <div className="container max-w-screen-lg">
      <div className="my-10 md:my-20">
        <p className="mb-2 text-center text-4xl font-normal">
          Choose Your Plan 🚀
        </p>

        <p className="mx-auto block max-w-prose text-center text-base font-light text-slate-600">
          Choose the plan that best suits your needs. If you need help, feel
          free to contact with us.
        </p>

        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>{" "}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-60 -z-20 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
          <div className="mt-10 flex flex-col justify-center gap-y-5 md:flex-row md:gap-x-3">
            <div className="mx-auto w-full max-w-sm rounded border bg-white px-3 py-5 md:w-1/2 md:px-6">
              <div className="flex h-14 w-14 items-center justify-center rounded border bg-blue-100">
                <RxRocket className="h-7 w-7 text-blue-600" />
              </div>
              <h2 className="mb-2 mt-5 text-4xl font-normal text-primary">
                {freePlan.title}
              </h2>
              <p className="font-light text-gray-500">{freePlan.description}</p>

              <div className="mt-5">
                <h1 className="text-5xl font-bold text-rose-600">
                  ${freePlan.price}
                  <span className="text-base">/month</span>
                </h1>
              </div>
              <Divider className="bg-gray-100" />

              <Space direction="vertical">
                {freePlan.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {feature.isAvailable ? (
                        <FaCheck className="text-gray-400" />
                      ) : (
                        <FaMinus className="text-gray-400" />
                      )}
                      <span className="ml-2">{feature.title}</span>
                      <Popover content={feature.footnote}>
                        <IoMdInformationCircleOutline className="ml-1.5 h-4 w-4 text-gray-500" />
                      </Popover>
                    </div>
                  </div>
                ))}
              </Space>

              <div className="mt-8">
                <Button href="/billing" size="large" type="default" block>
                  Get Started
                </Button>
              </div>
            </div>

            <div className="mx-auto w-full max-w-sm rounded border bg-white px-3 py-5 md:w-1/2 md:px-6">
              <div className="flex h-14 w-14 items-center justify-center rounded border bg-pink-100">
                <BsDiamondHalf className="h-7 w-7 text-pink-600" />
              </div>
              <h2 className="mb-2 mt-5 text-4xl font-normal text-primary">
                {premiumPlan.title}
              </h2>
              <p className="font-light text-gray-500">
                {premiumPlan.description}
              </p>

              <div className="mt-5">
                <h1 className="text-5xl font-bold text-rose-600">
                  ${premiumPlan.price}
                  <span className="text-base">/month</span>
                </h1>
              </div>
              <Divider className="bg-gray-100" />

              <Space direction="vertical">
                {premiumPlan.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {feature.isAvailable ? (
                        <FaCheck className="text-gray-400" />
                      ) : (
                        <FaMinus className="text-gray-400" />
                      )}
                      <span className="ml-2">{feature.title}</span>
                      <Popover content={feature.footnote}>
                        <IoMdInformationCircleOutline className="ml-1.5 h-4 w-4 text-gray-500" />
                      </Popover>
                    </div>
                  </div>
                ))}
              </Space>

              <div className="mt-8">
                <UpgradeButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
