"use client";
import { app_name_client } from "@/lib/utils";

const Description = () => {
  return (
    <p className="mt-4 text-center text-base leading-7 text-slate-600 lg:mt-8">
      🚀Unlock the full potential of your data with{" "}
      <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-cyan-500">
        <span className="relative font-semibold text-white">
          {app_name_client}!
        </span>
      </span>
      ! Seamlessly interact with your CSV and JSON files like never before.
      Simply upload your files, ask questions, and receive AI-generated answers
      tailored to your content. Say goodbye to manual data parsing and hello to
      intelligent insights at your fingertips. Elevate your document experience
      and unlock the power of intelligent information retrieval with{" "}
      {app_name_client}. Try it now!📃🤖
    </p>
  );
};

export default Description;
