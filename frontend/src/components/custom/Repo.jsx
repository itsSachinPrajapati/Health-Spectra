import React from "react";
import { useNavigate } from "react-router-dom";

export default function ReportAnalyzerCard() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/dashboard/tools/report-analyzer")}
      className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between text-center"
    >
      <div>
        <div className="text-5xl mb-4">📄</div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Report Analyzer</h2>
        <p className="text-gray-500">
          Upload medical reports and get quick AI-powered insights.
        </p>
      </div>

      <button className="mt-6 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition">
        Open
      </button>
    </div>
  );
}
