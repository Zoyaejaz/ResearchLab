import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  PenLine,
  Brain,
  CheckCircle2,
  LoaderCircle,
  Circle,
} from "lucide-react";

const agentDetails = {
  search: {
    name: "Search Agent",
    description: "Discovering reliable web resources",
    icon: Search,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  reader: {
    name: "Reader Agent",
    description: "Extracting and analyzing web content",
    icon: BookOpen,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  writer: {
    name: "Writer Agent",
    description: "Generating the research report",
    icon: PenLine,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  critic: {
    name: "Critic Agent",
    description: "Evaluating report quality",
    icon: Brain,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
};

export default function AgentCard({ type, status = "waiting" }) {
  const agent = agentDetails[type];
  const Icon = agent.icon;

  const statusStyles = {
    waiting: "text-slate-500",
    running: "text-blue-400",
    completed: "text-emerald-400",
    failed: "text-red-400",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`glass rounded-2xl p-5 transition ${
        status === "running"
          ? "border-violet-500/50 shadow-glow"
          : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div className={`w-11 h-11 rounded-xl ${agent.bg} flex items-center justify-center`}>
          <Icon size={22} className={agent.color} />
        </div>

        {status === "completed" && (
          <CheckCircle2 className="text-emerald-400" size={19} />
        )}

        {status === "running" && (
          <LoaderCircle className="text-blue-400 animate-spin" size={19} />
        )}

        {status === "waiting" && (
          <Circle className="text-slate-600" size={18} />
        )}

        {status === "failed" && (
          <Circle className="text-red-400" size={18} />
        )}
      </div>

      <h3 className="font-semibold mt-5">{agent.name}</h3>

      <p className="text-xs text-slate-500 mt-2">
        {agent.description}
      </p>

      <div className="flex items-center gap-2 mt-5">
        <span className={`w-1.5 h-1.5 rounded-full ${
          status === "completed" ? "bg-emerald-400" :
          status === "running" ? "bg-blue-400 animate-pulse" :
          status === "failed" ? "bg-red-400" : "bg-slate-600"
        }`} />

        <span className={`text-[11px] font-semibold uppercase ${statusStyles[status]}`}>
          {status}
        </span>
      </div>
    </motion.div>
  );
}