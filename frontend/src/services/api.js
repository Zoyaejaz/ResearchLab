
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Check backend connection
export const checkBackend = async () => {
  const response = await api.get("/api/health");
  return response.data;
};

// 2. Start new research
export const startResearch = async (topic) => {
  const response = await api.post("/api/research", {
    topic,
  });

  return response.data;
};

// 3. Get research progress and results
export const getResearchStatus = async (researchId) => {
  const response = await api.get(
    `/api/research/${researchId}`
  );

  return response.data;
};

// 4. Download Word or PDF report
export const downloadResearchReport = async (
  researchId,
  format
) => {
  const response = await api.get(
    `/api/research/${researchId}/export/${format}`,
    {
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data], {
    type:
      format === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `Research_Report.${format}`;

  document.body.appendChild(link);
  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};

export default api;
