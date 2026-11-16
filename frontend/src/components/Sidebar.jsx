
import {
  FlaskConical,
  LayoutDashboard,
  Clock,
  Network,
  Plus,
  Settings,
  Sparkles,
  PanelLeftClose,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar({
  activePage,
  setActivePage,
  onNewResearch,
}) {
  const navigation = [
    { id: "workspace", label: "Workspace", icon: LayoutDashboard },
    { id: "history", label: "Research History", icon: Clock },
    { id: "architecture", label: "Agent Architecture", icon: Network },
  ];

  return (
    <aside className="hidden md:flex w-[260px] min-h-screen flex-col border-r border-white/10 bg-[#0B1020] p-5">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-glow">
          <FlaskConical size={23} />
        </div>

        <div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Research<span className="text-violet-400">Lab</span>
          </h1>
          <p className="text-[10px] text-slate-500 tracking-[2px]">
            AI INTELLIGENCE
          </p>
        </div>
      </div>

      <button
        onClick={onNewResearch}
        className="flex items-center justify-center gap-2 w-full rounded-xl py-3 mb-8 bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-90 transition font-semibold text-sm shadow-glow"
      >
        <Plus size={18} />
        New Research
      </button>

      <p className="text-[10px] font-bold text-slate-500 tracking-[2px] mb-4">
        MENU
      </p>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl text-sm transition ${
                active
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-4 mb-5">
          <Sparkles className="text-violet-400 mb-3" size={20} />
          <h3 className="text-sm font-semibold">Research smarter</h3>
          <p className="text-xs text-slate-400 mt-2 leading-5">
            Let your AI research team discover, analyze and evaluate
            information automatically.
          </p>
        </div>

        <button className="flex items-center gap-3 text-slate-400 hover:text-white text-sm p-2">
          <Settings size={17} />
          Settings
        </button>

        <div className="border-t border-white/10 mt-4 pt-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center font-bold">
            R
          </div>
          <div>
            <p className="text-sm font-semibold">ResearchLab</p>
            <p className="text-xs text-slate-500">Personal workspace</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
