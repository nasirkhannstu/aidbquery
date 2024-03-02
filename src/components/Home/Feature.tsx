import { LuCpu, LuShieldCheck } from "react-icons/lu";
import { FaRocketchat } from "react-icons/fa";

import FixMaxWidth from "../FixMaxWidth";
import { app_name } from "@/lib/utils";

const Features = () => {
  return (
    <section id="features" className="pt-20">
      <FixMaxWidth className="flex flex-col justify-center">
        <div className="flex justify-center">
          <p className="rounded-3xl bg-primary px-3 py-1.5 text-sm font-bold text-white">
            BEST EVER FEATURES
          </p>
        </div>
        <h3 className="mb-2 mt-4 text-center text-3xl font-extrabold">
          <span className="text-primary">{app_name}</span> is a fully featured
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent drop-shadow-2xl">
            {" "}
            Artificial intelligence
          </span>{" "}
          based chat application for your documents
        </h3>

        <div className="mx-auto my-3 h-[2px] w-16 bg-primary" />

        {/* NOTE: feature */}
        <div className="my-4 flex flex-col justify-between gap-5 lg:flex-row">
          <div className="flex flex-1 flex-col justify-start rounded bg-white px-12 py-7 shadow-md ring-1 ring-zinc-300/30 hover:shadow-xl">
            <LuCpu className="h-14 w-14 text-primary" />
            <h2 className="pb-0 pt-4 text-xl font-semibold">
              Extreme performance
            </h2>
            <div className="mb-3 mt-2 h-[2px] w-[50px] bg-primary" />
            <p className="font-light text-muted-foreground">
              Our expert team is constantly working to improve the
              application&apos;s capabilities and keep it at the cutting edge of
              industry innovation. Stay ahead of the curve with our cutting-edge
              technology and exceptional user experience.
            </p>
          </div>
          <div className="flex flex-1 flex-col justify-start rounded bg-white px-12 py-7 shadow-md ring-1 ring-zinc-300/30 hover:shadow-xl">
            <LuShieldCheck className="h-14 w-14 text-primary" />
            <h2 className="pb-0 pt-4 text-xl font-semibold">Privacy focused</h2>
            <div className="mb-3 mt-2 h-[2px] w-[50px] bg-primary" />
            <p className="font-light text-muted-foreground">
              We assure you that your privacy is our number one priority. We
              safeguard your personal information and chats with strong security
              measures and encryption, providing you with peace of mind.
            </p>
          </div>
          <div className="flex flex-1 flex-col justify-start rounded bg-white px-12 py-7 shadow-md ring-1 ring-zinc-300/30 hover:shadow-xl">
            <FaRocketchat className="h-14 w-14 text-primary" />
            <h2 className="pb-0 pt-4 text-xl font-semibold">Realtime chat</h2>
            <div className="mb-3 mt-2 h-[2px] w-[50px] bg-primary" />
            <p className="font-light text-muted-foreground">
              The AI-powered system will provide real-time responses,
              facilitating user interaction and gaining insights from documents.
              Upload your documents and ask context-based questions.
            </p>
          </div>
        </div>
      </FixMaxWidth>
    </section>
  );
};

export default Features;
