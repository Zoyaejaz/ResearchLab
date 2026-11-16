import { motion } from "framer-motion";
import { ArrowRight, Activity } from "lucide-react";
import AgentCard from "./AgentCard";

const agentTypes = ["search", "reader", "writer", "critic"];

export default function AgentWorkflow({ progress, currentStep, status }) {
  const getAgentStatus = (index) => {
    if (status === "completed") return "completed";
    if (status === "failed") {
      return index < currentStep ? "completed" :
        index === currentStep ? "failed" : "waiting";
    }

    if (index < currentStep) return "completed";
    if (index === currentStep && status === "running") return "running";

    return "waiting";
  };

  return (
    <div className="glass rounded-2xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg">Agent Workflow</h3>
          <p className="text-xs text-slate-500 mt-1">
            Watch your research team collaborate
          </p>
        </div>

        <Activity className="text-violet-400" size={21} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {agentTypes.map((type, index) => (
          <div key={type} className="relative">
            <AgentCard
              type={type}
              status={getAgentStatus(index)}
            />

            {index !== 3 && (
              <div className="hidden xl:flex absolute top-1/2 -right-3 z-10 text-slate-600">
                <ArrowRight size={18} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-7">
        <div className="flex justify-between text-xs mb-3">
          <span className="text-slate-400">Overall progress</span>
          <span className="text-violet-300 font-bold">{progress}%</span>
        </div>

        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400"
          />
        </div>
      </div>
    </div>
  );
}