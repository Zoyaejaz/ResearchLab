import { motion } from "framer-motion";
import { Brain, Award, CheckCircle2, AlertCircle } from "lucide-react";

export default function CriticPanel({ feedback }) {
  if (!feedback) return null;

  const match = feedback.match(/Score:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i);
  const score = match ? Number(match[1]) : null;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <Brain className="text-amber-400" size={22} />
        </div>

        <div>
          <h3 className="font-bold">Critic Evaluation</h3>
          <p className="text-xs text-slate-500">
            Quality assessment by your Critic Agent
          </p>
        </div>
      </div>

      {score !== null && (
        <div className="flex items-center gap-6 mb-7 p-5 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-amber-400">
              {score}
              <span className="text-lg text-slate-500">/10</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
              Quality Score
            </p>
          </div>

          <Award className="text-amber-400" size={35} />
        </div>
      )}

      <div className="space-y-4">
        {feedback.split("\n").map((line, index) => {
          const clean = line.trim();

          if (!clean) return null;

          const isStrength = /strengths:/i.test(clean);
          const isImprove = /areas to improve:/i.test(clean);
          const isVerdict = /one line verdict:/i.test(clean);
          const heading = isStrength || isImprove || isVerdict;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={heading ? "pt-2" : "text-sm text-slate-300 leading-6"}
            >
              {heading ? (
                <div className="flex items-center gap-2 font-semibold text-white">
                  {isStrength ? (
                    <CheckCircle2 className="text-emerald-400" size={17} />
                  ) : (
                    <AlertCircle className="text-amber-400" size={17} />
                  )}
                  {clean.replace(":", "")}
                </div>
              ) : (
                clean
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}