import React, { useState, useRef } from "react";
import axios from "axios";
import DashboardHeader from "@/PatientDashboard/DashboardHeader";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { generateReportPDF } from "../utils/GenerateReport";

export default function ReportAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const fileInputRef = useRef();
  const reportRef = useRef();


  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/analyze`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.analysis) {
        setAnalysis(response.data.analysis);
      } else if (response.data.error) {
        setAnalysis({ error: response.data.error });
      } else {
        setAnalysis({ error: "Unknown error occurred." });
      }
    } catch (err) {
      console.error(err);
      setAnalysis({ error: "Something went wrong while analyzing the report." });
    } finally {
      setLoading(false);
    }
  };

  const getStatusUI = (status) => {
    if (!status)
      return {
        color: "text-gray-600",
        bg: "bg-gray-100",
        icon: <AlertTriangle className="inline ml-1" />,
      };

    if (status.toLowerCase().includes("high"))
      return {
        color: "text-red-700",
        bg: "bg-red-100",
        icon: <XCircle className="inline ml-1" />,
      };

    if (status.toLowerCase().includes("low"))
      return {
        color: "text-blue-700",
        bg: "bg-blue-100",
        icon: <AlertTriangle className="inline ml-1" />,
      };

    if (
      status.toLowerCase().includes("elevated") ||
      status.toLowerCase().includes("borderline")
    )
      return {
        color: "text-orange-700",
        bg: "bg-orange-100",
        icon: <AlertTriangle className="inline ml-1" />,
      };

    return {
      color: "text-green-700",
      bg: "bg-green-100",
      icon: <CheckCircle className="inline ml-1" />,
    };
  };

  const handleDownloadPDF = () => {
    generateReportPDF(analysis);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      <div className="px-10 py-8">
        <h1 className="text-4xl text-center font-bold text-blue-700 mb-6">
          📑 Medical Report Analyzer
        </h1>

        {/* File Upload */}
        <div
          className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition mb-6"
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="text-6xl mb-2">📄</div>
          <h2 className="text-xl font-semibold mb-1 text-gray-800">
            {file ? "File Selected" : "Drag & Drop Your Report Here"}
          </h2>
          <p className="text-gray-500 text-center mb-2">
            {file ? file.name : "or click to browse your computer"}
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition mb-6"
        >
          {loading ? "Analyzing...": "Analyze Report"}
        </button>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            ℹ️ How to Read Your Report
          </h2>

          <div className="flex flex-wrap gap-4 mb-4">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-200 rounded"></span> Normal
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-200 rounded"></span> High
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-200 rounded"></span> Low
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-orange-200 rounded"></span> Elevated
            </span>
          </div>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>✅ Extracts your test values from the uploaded report.</li>
            <li>📊 Compares results against standard reference ranges.</li>
            <li>⚠️ Flags high or low results with colors.</li>
            <li>🧠 Provides explanations, risks, and lifestyle suggestions.</li>
            <li>📋 Ends with a summary: assessment, risks, and recommendations.</li>
          </ul>
        </div>

        {/* Errors */}
        {analysis?.error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            {analysis.error}
          </div>
        )}

        {/* Report content */}
        {analysis && !analysis.error && (
          <div ref={reportRef}>
            {/* Table of Tests */}
            {analysis.tests?.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-2 px-4 text-left">Test Name</th>
                      <th className="py-2 px-4 text-left">Result</th>
                      <th className="py-2 px-4 text-left">Normal Range</th>
                      <th className="py-2 px-4 text-left">Status</th>
                      <th className="py-2 px-4 text-left">Explanation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.tests.map((test, idx) => {
                      const statusUI = getStatusUI(test.status || "");
                      return (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                          <td className="py-2 px-4">{test.testName}</td>
                          <td
                            className={`py-2 px-4 font-medium text-center rounded ${statusUI.bg} ${statusUI.color}`}
                          >
                            {test.result}
                          </td>
                          <td className="py-2 px-4 text-gray-500">
                            {test.normalRange}
                          </td>
                          <td
                            className={`py-2 px-4 font-medium ${statusUI.color}`}
                          >
                            {test.status} {statusUI.icon}
                          </td>
                          <td className="py-2 px-4 text-gray-700">
                            {test.explanation}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sections */}
            <div className="mt-6 space-y-5 bg-white p-6 rounded shadow">
              {analysis.overallAssessment && (
                <div>
                  <h3 className="font-semibold text-lg text-blue-700 mb-1">
                    📝 Overall Assessment
                  </h3>
                  {Array.isArray(analysis.overallAssessment) ? (
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {analysis.overallAssessment.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">
                      {analysis.overallAssessment}
                    </p>
                  )}
                </div>
              )}

              {analysis.keyRisks && (
                <div>
                  <h3 className="font-semibold text-lg text-red-700 mb-1">
                    ⚠️ Key Risks
                  </h3>
                  {Array.isArray(analysis.keyRisks) ? (
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {analysis.keyRisks.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">{analysis.keyRisks}</p>
                  )}
                </div>
              )}

              {analysis.lifestyleChanges && (
                <div>
                  <h3 className="font-semibold text-lg text-green-700 mb-1">
                    💡 Lifestyle Changes
                  </h3>
                  {Array.isArray(analysis.lifestyleChanges) ? (
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {analysis.lifestyleChanges.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">
                      {analysis.lifestyleChanges}
                    </p>
                  )}
                </div>
              )}

              {analysis.recommendations && (
                <div>
                  <h3 className="font-semibold text-lg text-purple-700 mb-1">
                    ✅ Recommendations
                  </h3>
                  {Array.isArray(analysis.recommendations) ? (
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {analysis.recommendations.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">
                      {analysis.recommendations}
                    </p>
                  )}
                </div>
              )}

              {analysis.futureConcerns && (
                <div>
                  <h3 className="font-semibold text-lg text-orange-700 mb-1">
                    🔮 Future Concerns
                  </h3>
                  {Array.isArray(analysis.futureConcerns) ? (
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {analysis.futureConcerns.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">{analysis.futureConcerns}</p>
                  )}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                📥 Download Report
              </button>
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition"
              >
                🏠 Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
