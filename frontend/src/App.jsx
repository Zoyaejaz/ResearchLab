
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  LoaderCircle,
  FileSearch,
  Clock,
  Network,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ResearchInput from "./components/ResearchInput";
import AgentWorkflow from "./components/AgentWorkflow";
import ReportViewer from "./components/ReportViewer";
import CriticPanel from "./components/CriticPanel";

import {
  checkBackend,
  startResearch,
  getResearchStatus,
} from "./services/api";


const initialResearch = {
  id: null,
  topic: "",
  status: "idle",
  progress: 0,
  current_step: 0,
  result: null,
  error: null,
};


export default function App() {
  const [activePage, setActivePage] = useState("workspace");
  const [research, setResearch] = useState(initialResearch);
  const [history, setHistory] = useState([]);
  const [connected, setConnected] = useState(false);

  const pollingRef = useRef(null);

  // Check backend connection
  useEffect(() => {
    const check = async () => {
      try {
        await checkBackend();
        setConnected(true);
      } catch {
        setConnected(false);
      }
    };

    check();

    const interval = setInterval(check, 10000);

    return () => clearInterval(interval);
  }, []);

  // Clear polling when component unmounts
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Start research
  const handleResearch = async (topic) => {
    if (!topic.trim()) return;

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    setResearch({
      ...initialResearch,
      topic,
      status: "starting",
    });

    try {
      const response = await startResearch(topic);

      setResearch((prev) => ({
        ...prev,
        id: response.research_id,
        status: "running",
      }));

      setActivePage("workspace");

      pollResearch(response.research_id);

    } catch (error) {
      setResearch((prev) => ({
        ...prev,
        status: "failed",
        error:
          error.response?.data?.detail ||
          error.message ||
          "Unable to start research.",
      }));
    }
  };

  // Poll backend for progress
  const pollResearch = (id) => {
    let stopped = false;

    const poll = async () => {
      if (stopped) return;

      try {
        const data = await getResearchStatus(id);

        setResearch((prev) => ({
          ...prev,
          ...data,
          id,
        }));

        if (
          data.status === "completed" ||
          data.status === "failed"
        ) {
          stopped = true;
          clearInterval(pollingRef.current);
          pollingRef.current = null;

          if (data.status === "completed" && data.result) {
            setHistory((prev) => [
              {
                id,
                topic: data.topic,
                result: data.result,
                completedAt: new Date().toISOString(),
              },
              ...prev.filter((item) => item.id !== id),
            ]);
          }
        }
      } catch (error) {
        stopped = true;
        clearInterval(pollingRef.current);
        pollingRef.current = null;

        setResearch((prev) => ({
          ...prev,
          status: "failed",
          error:
            error.response?.data?.detail ||
            "Lost connection to the research server.",
        }));
      }
    };

    poll();

    pollingRef.current = setInterval(poll, 1600);
  };

  const newResearch = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    setResearch(initialResearch);
    setActivePage("workspace");
  };

  const openHistory = (item) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    setResearch({
      id: item.id,
      topic: item.topic,
      status: "completed",
      progress: 100,
      current_step: 4,
      result: item.result,
      error: null,
    });

    setActivePage("workspace");
  };

  const currentTitle = {
    workspace: "Research Workspace",
    history: "Research History",
    architecture: "Agent Architecture",
  };

  const currentSubtitle = {
    workspace: "Your intelligent multi-agent research environment",
    history: "Explore your completed research sessions",
    architecture: "Understand how your AI research team works",
  };

  const result = research.result;

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onNewResearch={newResearch}
      />

      <main className="flex-1 min-w-0 grid-background">

        <Header
          title={currentTitle[activePage]}
          subtitle={currentSubtitle[activePage]}
          connected={connected}
        />

        <div className="max-w-[1500px] mx-auto p-5 md:p-8 space-y-7">

          {/* WORKSPACE */}
          {activePage === "workspace" && (
            <>
              {research.status === "idle" && (
                <ResearchInput
                  onSubmit={handleResearch}
                  loading={false}
                />
              )}

              {research.status !== "idle" && (
                <div className="glass rounded-2xl p-5 md:p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="text-violet-400" />
                    <span className="text-xs uppercase tracking-widest text-violet-300 font-bold">
                      Current Research
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold">
                    {research.topic}
                  </h2>

                  <div className="flex items-center gap-2 mt-3 text-sm text-slate-400">
                    {research.status === "running" ||
                    research.status === "starting" ? (
                      <LoaderCircle
                        className="animate-spin text-blue-400"
                        size={16}
                      />
                    ) : research.status === "completed" ? (
                      <Sparkles
                        className="text-emerald-400"
                        size={16}
                      />
                    ) : (
                      <AlertCircle className="text-red-400" size={16} />
                    )}

                    <span className="capitalize">
                      {research.status}
                    </span>
                  </div>
                </div>
              )}

              {(research.status === "idle" ||
                research.status === "starting" ||
                research.status === "running" ||
                research.status === "completed" ||
                research.status === "failed") && (
                <>
                  <AgentWorkflow
                    progress={research.progress || 0}
                    currentStep={research.current_step || 0}
                    status={research.status}
                  />

                  {research.status === "running" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 rounded-xl bg-blue-500/5 border border-blue-500/10 p-4"
                    >
                      <LoaderCircle
                        className="animate-spin text-blue-400"
                        size={18}
                      />

                      <div>
                        <p className="text-sm font-semibold">
                          Your agents are working...
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {research.message || "Processing research..."}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {research.status === "failed" && (
                    <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-5">
                      <div className="flex items-center gap-2 text-red-400 font-semibold">
                        <AlertCircle size={19} />
                        Research failed
                      </div>
                      <p className="text-sm text-slate-400 mt-2">
                        {research.error || "An unexpected error occurred."}
                      </p>
                      <button
                        onClick={newResearch}
                        className="mt-4 text-sm text-violet-300 flex items-center gap-2"
                      >
                        <RefreshCw size={15} /> Try again
                      </button>
                    </div>
                  )}
                </>
              )}

              {research.status === "completed" && result && (
                <>
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    <div className="xl:col-span-2">
                      <ReportViewer
                        report={result.report}
                        researchId={research.id}
                        />
                    </div>

                    <div className="space-y-5">
                      <CriticPanel feedback={result.feedback} />

                      <div className="glass rounded-2xl p-5">
                        <h3 className="font-bold mb-4">
                          Research Sources
                        </h3>

                        <div className="text-sm text-slate-400 whitespace-pre-wrap break-words max-h-72 overflow-y-auto">
                          {result.search_results}
                        </div>
                      </div>
                    </div>
                  </div>

                  <details className="glass rounded-2xl p-5">
                    <summary className="cursor-pointer font-semibold text-sm">
                      View detailed scraped content
                    </summary>

                    <div className="mt-4 text-sm text-slate-400 whitespace-pre-wrap leading-7 max-h-96 overflow-y-auto">
                      {result.scraped_content}
                    </div>
                  </details>

                  <button
                    onClick={newResearch}
                    className="rounded-xl px-5 py-3 bg-violet-600 hover:bg-violet-500 text-sm font-semibold transition"
                  >
                    + Start New Research
                  </button>
                </>
              )}
            </>
          )}

          {/* HISTORY */}
          {activePage === "history" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Previous Research</h2>

              {history.length === 0 ? (
                <div className="glass rounded-2xl p-10 text-center">
                  <Clock
                    className="mx-auto text-slate-500 mb-4"
                    size={35}
                  />
                  <p className="font-semibold">No research history yet</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Your completed research sessions will appear here.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => openHistory(item)}
                    className="glass w-full rounded-xl p-5 text-left hover:border-violet-500/40 transition"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.topic}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(item.completedAt).toLocaleString()}
                        </p>
                      </div>
                      <FileSearch className="text-violet-400 shrink-0" />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* ARCHITECTURE */}
          {activePage === "architecture" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Multi-Agent Architecture
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  Four specialized agents collaborate to produce
                  high-quality research.
                </p>
              </div>

              {[
                {
                  number: "01",
                  name: "Search Agent",
                  detail: "Uses Tavily to find recent, reliable web information and relevant URLs.",
                  color: "text-blue-400",
                },
                {
                  number: "02",
                  name: "Reader Agent",
                  detail: "Uses BeautifulSoup and Requests to scrape and extract website content.",
                  color: "text-violet-400",
                },
                {
                  number: "03",
                  name: "Writer Agent",
                  detail: "Combines search results and scraped content to create a structured report.",
                  color: "text-cyan-400",
                },
                {
                  number: "04",
                  name: "Critic Agent",
                  detail: "Reviews the generated report and assigns a quality score with feedback.",
                  color: "text-amber-400",
                },
              ].map((agent) => (
                <motion.div
                  key={agent.number}
                  whileHover={{ x: 5 }}
                  className="glass rounded-2xl p-6 flex gap-5"
                >
                  <div className={`text-3xl font-extrabold ${agent.color}`}>
                    {agent.number}
                  </div>
                  <div>
                    <h3 className="font-bold">{agent.name}</h3>
                    <p className="text-sm text-slate-400 mt-2 leading-6">
                      {agent.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>

        <footer className="border-t border-white/10 py-5 px-8 text-center text-xs text-slate-600">
          ResearchLab · Powered by LangChain, Groq and Tavily
        </footer>

      </main>
    </div>
  );
}
