import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { useUser } from "@clerk/clerk-react";

// --- Safe JSON parsing helper ---
function safeParse(data, fallback) {
  if (!data) return fallback;

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      // if it's plain text, return it as text instead of failing
      return data;
    }
  }

  return data;
}
// --- Date formatting ---
function formatDate(dateString) {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    console.warn("Invalid date string:", dateString);
    return "-";
  }
}

// --- Reusable Section component ---
function Section({ title, children }) {
  return (
    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
      <h3 className="font-semibold text-blue-600 mb-2">{title}</h3>
      {children}
    </div>
  );
}

function ViewReport({ consultation = {} }) {
  const { user } = useUser();

  // Memoized parsing for performance
  const reportData = useMemo(
    () => safeParse(consultation.report, {}),
    [consultation.report]
  );
  const messagesArray = useMemo(() => {
    const parsed = safeParse(consultation.messages, []);
    return Array.isArray(parsed) ? parsed : [];
  }, [consultation.messages]);

  const hasReport = Object.keys(reportData).length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer text-sm font-medium text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition">
          View Report
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg bg-white rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh] sm:px-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-center text-blue-600">
            🩺 AI Doctor Medical Report
          </DialogTitle>
          <p className="text-gray-500 text-sm text-center mt-1">
            Detailed summary of your consultation
          </p>
        </DialogHeader>

        {!hasReport ? (
          <p className="text-center text-gray-500 mt-6">No report available yet.</p>
        ) : (
          <div className="mt-5 space-y-5 text-sm">
            {/* Consultation Info */}
            <Section title="Consultation Info">
              <p>
                <strong>Doctor:</strong>{" "}
                {reportData.medical_specialist || consultation.selected_doctor || "-"}
              </p>
              <p>
                <strong>Patient:</strong> {user?.firstName || "User"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {formatDate(
                  reportData.current_date_time_UTC || consultation.created_on
                )}
              </p>
            </Section>

            {/* Chief Complaint */}
            <Section title="Chief Complaint">
              <p>{reportData.chief_complaint || consultation.notes || "-"}</p>
            </Section>

            {/* Findings */}
            <Section title="Findings / Observations">
              <p>{reportData.findings || "-"}</p>
            </Section>

            {/* Medicines */}
            <Section title="Prescribed Medicines">
              {reportData.medicines?.length > 0 ? (
                <ul className="list-disc ml-5 text-gray-700">
                  {reportData.medicines.map((med, i) =>
                    typeof med === "string" ? (
                      <li key={i}>{med}</li>
                    ) : (
                      <li key={i}>
                        <strong>{med.name || "Medicine"}</strong>{" "}
                        {med.dosage && `— ${med.dosage}`}{" "}
                        {med.duration && `, ${med.duration}`}{" "}
                        {med.purpose && `(${med.purpose})`}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>-</p>
              )}
            </Section>

            {/* Recommendations */}
            <Section title="Doctor Recommendations">
              {reportData.recommendations?.length > 0 ? (
                <ul className="list-disc ml-5 text-gray-700">
                  {reportData.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              ) : (
                <p>-</p>
              )}
            </Section>

            {/* Lifestyle Advice */}
            <Section title="Lifestyle Advice">
              {reportData.lifestyle_advice?.length > 0 ? (
                <ul className="list-disc ml-5 text-gray-700">
                  {reportData.lifestyle_advice.map((ad, i) => (
                    <li key={i}>{ad}</li>
                  ))}
                </ul>
              ) : (
                <p>-</p>
              )}
            </Section>

            {/* AI Suggestions */}
            <Section title="AI Suggestions">
              {reportData.ai_suggestions?.length > 0 ? (
                <ul className="list-disc ml-5 text-gray-700">
                  {reportData.ai_suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p>-</p>
              )}
            </Section>

            {/* Conversation History */}
            <Section title="Conversation History">
              <div className="space-y-2">
                {messagesArray?.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-md ${
                      msg.role === "assistant"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-100 text-blue-900"
                    }`}
                  >
                    <strong>
                      {msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}:
                    </strong>{" "}
                    {msg.text}
                  </div>
                ))}
              </div>
            </Section>

            {/* Footer */}
            <div className="mt-4 border-t pt-2 text-gray-500 text-xs italic text-center">
              This report is AI generated. Please consult a licensed doctor for confirmation.
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ViewReport;
