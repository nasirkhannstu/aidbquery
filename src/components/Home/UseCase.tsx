import { GrRisk } from "react-icons/gr";
import { LuBadgeDollarSign } from "react-icons/lu";
import { PiStudentDuotone } from "react-icons/pi";
import { IoMdAnalytics } from "react-icons/io";
import { IoBusiness } from "react-icons/io5";
import { FaChartBar, FaChartPie } from "react-icons/fa6";
import { MdOutlineHealthAndSafety } from "react-icons/md";

import FixMaxWidth from "../FixMaxWidth";
import UseCaseCard from "./UseCaseCard";
import { app_name } from "@/lib/utils";

const UseCaseSection = () => {
  return (
    <section id="use-case" className="mb-5 pt-20 md:min-h-screen">
      <FixMaxWidth>
        <h3 className="text-center text-2xl text-primary">
          All-in-one Database Platform
        </h3>
        <h2 className="my-3 text-center text-5xl font-extrabold tracking-tighter text-black drop-shadow-md">
          Use Cases
        </h2>
        <div className="use-case__wrapper mt-16 grid items-center gap-0 rounded bg-white">
          <div className="flex w-full flex-col items-center gap-0 border-b-0 md:flex-row md:border-b">
            <UseCaseCard
              rightBorder
              Icon={IoMdAnalytics}
              iconColor="text-slate-600"
              iconBgColor="bg-slate-500/10"
              title="Data Analysis and Visualization"
              description={`Use ${app_name} to quickly extract insights from large CSV and JSON datasets, allowing users to visualize trends, patterns, and correlations effortlessly.`}
            />
            <UseCaseCard
              rightBorder={false}
              Icon={IoBusiness}
              iconColor="text-indigo-600"
              iconBgColor="bg-indigo-500/10"
              title="Business Intelligence"
              description={`${app_name} can aid in business intelligence tasks by enabling users to ask natural language questions about their data, helping to identify opportunities, detect anomalies, and make informed decisions.`}
            />
          </div>
          <div className="flex w-full flex-col items-center gap-0 border-b-0 md:flex-row md:border-b">
            <UseCaseCard
              rightBorder
              Icon={PiStudentDuotone}
              iconColor="text-amber-600"
              iconBgColor="bg-amber-500/10"
              title="Educational Assistance"
              description={`${app_name} is a valuable teaching tool that facilitates dialogue between educators and students, aiding in understanding complex concepts in data science, statistics, and economics.`}
            />
            <UseCaseCard
              rightBorder={false}
              Icon={MdOutlineHealthAndSafety}
              iconColor="text-cyan-600"
              iconBgColor="bg-cyan-500/10"
              title="Healthcare Analytics"
              description={`Healthcare professionals may utilize ${app_name} to track health outcomes, evaluate patient data, and spot patterns in diagnoses and treatments—all of which will enhance patient care.`}
            />
          </div>
          <div className="flex w-full flex-col items-center gap-0 border-b-0 md:flex-row md:border-b">
            <UseCaseCard
              rightBorder
              Icon={FaChartPie}
              iconColor="text-rose-600"
              iconBgColor="bg-rose-500/10"
              title="Research and Analysis"
              description={`Researchers can leverage ${app_name} to explore datasets, formulate hypotheses, and conduct exploratory data analysis, speeding up the research process and facilitating knowledge discovery.`}
            />
            <UseCaseCard
              rightBorder={false}
              Icon={LuBadgeDollarSign}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-500/10"
              title="Financial Analysis"
              description={`${app_name} is a tool utilized by financial professionals for analyzing financial data, tracking performance metrics, and producing reports on key indicators like revenue, expenses, and profitability.`}
            />
          </div>

          <div className="flex w-full flex-col items-center gap-0 md:flex-row">
            <UseCaseCard
              rightBorder
              Icon={FaChartBar}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-500/10"
              title="Marketing Insights"
              description={`Marketers can employ ${app_name} to analyze customer data, segment audiences, and identify effective marketing strategies based on customer behavior and preferences, enhancing targeting and campaign performance.`}
            />
            <UseCaseCard
              rightBorder={false}
              Icon={GrRisk}
              iconColor="text-cyan-600"
              iconBgColor="bg-cyan-500/10"
              title="Compliance and Risk Management"
              description={`${app_name} can help organizations ensure compliance with regulations and manage risks by analyzing data for potential issues such as fraud, security breaches, and regulatory violations, enabling proactive mitigation strategies.`}
            />
          </div>
        </div>
      </FixMaxWidth>
    </section>
  );
};

export default UseCaseSection;
