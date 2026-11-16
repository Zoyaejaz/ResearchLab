
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Download,
  FileText,
  FileType,
  Copy,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

import { downloadResearchReport } from "../services/api";


export default function ReportViewer({ report, researchId }) {

  const [downloading, setDownloading] = useState(null);
  const [downloaded, setDownloaded] = useState(null);
  const [error, setError] = useState("");

  const handleDownload = async (format) => {

    if (!researchId || downloading) return;

    try {

      setDownloading(format);
      setDownloaded(null);
      setError("");

      await downloadResearchReport(researchId, format);

      setDownloaded(format);

    } catch (err) {

      setError(
        err.response?.data?.detail ||
        "Unable to download the report. Please try again."
      );

    } finally {

      setDownloading(null);

    }
  };


  const copyReport = async () => {

    try {

      await navigator.clipboard.writeText(report);

    } catch {

      setError("Unable to copy the report.");

    }
  };


  if (!report) return null;


  return (

    <div className="glass rounded-2xl overflow-hidden">

      {/* HEADER */}

      <div className="flex flex-col gap-4 p-5 border-b border-white/10">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <FileText className="text-violet-400" size={22} />
          </div>

          <div>
            <h3 className="font-bold text-lg">
              Research Report
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Your AI-generated research document
            </p>
          </div>

        </div>


        {/* DOWNLOAD BUTTONS */}

        <div className="flex flex-wrap items-center gap-2">

          <button
            onClick={() => handleDownload("docx")}
            disabled={!!downloading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 transition text-xs font-semibold disabled:opacity-50"
          >

            {downloading === "docx" ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : downloaded === "docx" ? (
              <CheckCircle2 size={16} />
            ) : (
              <FileType size={16} />
            )}

            {downloading === "docx"
              ? "Preparing Word..."
              : downloaded === "docx"
              ? "Word Downloaded"
              : "Download Word"}

          </button>


          <button
            onClick={() => handleDownload("pdf")}
            disabled={!!downloading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition text-xs font-semibold disabled:opacity-50"
          >

            {downloading === "pdf" ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : downloaded === "pdf" ? (
              <CheckCircle2 size={16} />
            ) : (
              <Download size={16} />
            )}

            {downloading === "pdf"
              ? "Preparing PDF..."
              : downloaded === "pdf"
              ? "PDF Downloaded"
              : "Download PDF"}

          </button>


          <button
            onClick={copyReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition text-xs font-semibold"
          >
            <Copy size={15} />
            Copy
          </button>

        </div>

        {error && (
          <p className="text-xs text-red-400">
            {error}
          </p>
        )}

      </div>


      {/* REPORT CONTENT */}

      <div className="p-6 md:p-8 markdown-content">

        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {report}
        </ReactMarkdown>

      </div>

    </div>

  );
}
