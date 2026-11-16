import { Bell, CircleHelp, Wifi } from "lucide-react";

export default function Header({ title, subtitle, connected = true }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 px-5 md:px-8 py-5">
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
          <span
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-emerald-400" : "bg-red-400"
            }`}
          />
          <span className="text-xs text-slate-400">
            {connected ? "Backend connected" : "Backend disconnected"}
          </span>
        </div>

        <button className="text-slate-400 hover:text-white">
          <Bell size={19} />
        </button>

        <button className="text-slate-400 hover:text-white">
          <CircleHelp size={19} />
        </button>
      </div>
    </header>
  );
}