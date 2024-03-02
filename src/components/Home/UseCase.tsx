import { BiSolidAnalyse } from "react-icons/bi";
import { TbTextResize } from "react-icons/tb";
import { FaConnectdevelop } from "react-icons/fa";
import { GiMaterialsScience, GiArtificialIntelligence } from "react-icons/gi";
import { GrGrow } from "react-icons/gr";
import { LuBadgeDollarSign } from "react-icons/lu";
import { CiMedicalCross } from "react-icons/ci";

import FixMaxWidth from "../FixMaxWidth";
import UseCaseCard from "./UseCaseCard";

const UseCaseSection = () => {
  return (
    <section id="use-case" className="mb-5 pt-20 md:min-h-screen">
      <FixMaxWidth>
        <h3 className="text-center text-2xl text-primary">
          All-in-one Platform
        </h3>
        <h2 className="my-3 text-center text-5xl font-extrabold tracking-tighter text-black drop-shadow-md">
          Use Cases
        </h2>
        <div className="use-case__wrapper mt-16 grid items-center gap-0 rounded bg-white">
          <div className="flex w-full flex-col items-center gap-0 border-b-0 md:flex-row md:border-b">
            <UseCaseCard
              rightBorder
              Icon={GiArtificialIntelligence}
              iconColor="text-slate-600"
              iconBgColor="bg-slate-500/10"
              title="Business Intelligence"
              description="In the corporate world, application aids in extracting
                actionable insights from business reports, market analyses, and
                competitor information, empowering decision-makers with
                data-driven strategies."
            />
            <UseCaseCard
              rightBorder={false}
              Icon={BiSolidAnalyse}
              iconColor="text-indigo-600"
              iconBgColor="bg-indigo-500/10"
              title="Document Analysis"
              description="Analyze the content of the uploaded documents to identify key
              themes, topics, and entities."
            />
          </div>
          <div className="flex w-full flex-col items-center gap-0 border-b-0 md:flex-row md:border-b">
            <UseCaseCard
              rightBorder
              Icon={FaConnectdevelop}
              iconColor="text-sky-600"
              iconBgColor="bg-sky-500/10"
              title="Contextual Understanding"
              description="Develop a system to understand the context within the uploaded
              documents."
            />
            <UseCaseCard
              rightBorder={false}
              Icon={TbTextResize}
              iconColor="text-amber-600"
              iconBgColor="bg-amber-500/10"
              title="Document Summarization"
              description="Implement a summarization feature to condense the key
              information from the uploaded documents."
            />
          </div>
          <div className="flex w-full flex-col items-center gap-0 border-b-0 md:flex-row md:border-b">
            <UseCaseCard
              rightBorder
              Icon={GiMaterialsScience}
              iconColor="text-rose-600"
              iconBgColor="bg-rose-500/10"
              title="Research and Education"
              description="Application serves as an invaluable tool for researchers and
              educators, helping them efficiently analyze and extract
              information from academic papers, articles, and various
              educational resources."
            />
            <UseCaseCard
              rightBorder={false}
              Icon={GrGrow}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-500/10"
              title="Personal Productivity"
              description="Individuals can streamline their personal research, organize
              information, and quickly grasp the key points of any document
              using OfficeAI, thereby enhancing overall productivity."
            />
          </div>
          <div className="flex w-full flex-col items-center gap-0 md:flex-row">
            <UseCaseCard
              rightBorder
              Icon={LuBadgeDollarSign}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-500/10"
              title="Financial Document Insights"
              description="Provide insights into financial documents by analyzing trends,
              risks, and opportunities mentioned in reports."
            />
            <UseCaseCard
              rightBorder={false}
              Icon={CiMedicalCross}
              iconColor="text-cyan-600"
              iconBgColor="bg-cyan-500/10"
              title="Medical Document Analysis"
              description="Analyze medical documents to extract important information, such
              as symptoms, diagnoses, and treatment options."
            />
          </div>
        </div>
      </FixMaxWidth>
    </section>
  );
};

export default UseCaseSection;
