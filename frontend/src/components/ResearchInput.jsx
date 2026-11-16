import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Search } from "lucide-react";

const suggestions = [
  "Latest advancements in Generative AI",
  "Applications of machine learning in healthcare",
  "Future of autonomous AI agents",
];

export default function ResearchInput({ onSubmit, loading }) {
  const [topic, setTopic] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (!topic.trim() || loading) return;

    onSubmit(topic.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-[#17152E] via-[#111A31] to-[#0D1627] p-6 md:p-9"
    >
      <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs mb-6">
          <Sparkles size={14} />
          Powered by Multi-Agent Intelligence
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
          Research anything.
          <br />
          <span className="gradient-text">
            Let AI do the heavy lifting.
          </span>
        </h1>

        <p className="text-slate-400 text-sm leading-6 mt-4 max-w-xl">
          Four specialized AI agents work together to search the web,
          analyze information, write detailed reports and evaluate
          their quality.
        </p>

        <form onSubmit={submit} className="mt-8">
          <div className="flex items-start gap-3 bg-[#080D1A]/80 border border-white/10 rounded-2xl p-3 focus-within:border-violet-500/60 transition">
            <Search className="text-violet-400 mt-3 ml-2 shrink-0" size={20} />

            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What would you like to research today?"
              rows={2}
              className="flex-1 bg-transparent outline-none resize-none text-sm text-white placeholder:text-slate-600 py-2"
            />

            <button
              type="submit"
              disabled={!topic.trim() || loading}
              className="self-end flex items-center gap-2 rounded-xl px-4 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition"
            >
              {loading ? "Researching..." : "Research"}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 mt-5">
          <span className="text-xs text-slate-500 py-2">Try:</span>

          {suggestions.map((item) => (
            <button
              key={item}
              onClick={() => setTopic(item)}
              className="text-xs text-slate-400 border border-white/10 rounded-full px-3 py-2 hover:border-violet-500/40 hover:text-violet-300 transition"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}