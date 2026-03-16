import React, { useState } from "react";
import DashboardHeader from "../../PatientDashboard/DashboardHeader";

export default function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));
    setResult(null); 
    setConfidence(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload an MRI image first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/predict`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setResult(data.result);
      setConfidence(data.confidence);
    } catch (error) {
      console.error("Error uploading:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          🧠 MRI Disease Detection
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border rounded-md w-full"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-64 h-64 object-cover rounded-xl shadow-md border"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-medium transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Detecting..." : "Detect"}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
            <h2 className="text-xl font-bold text-gray-800">{result}</h2>
            <p className="text-gray-600 mt-2">
              Confidence: <span className="font-semibold">{confidence}%</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
