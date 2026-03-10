import React, { useEffect, useState } from "react";
import DoctorsAgentList from "../Doctor/DoctorsAgentList";
import HistoryTable from "../consultation_history/HistoryTable";
import DashboardHeader from "./DashboardHeader";
import AddSymptom from "../components/custom/AddSymptom.jsx";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function Dashboard() {
  const { has } = useAuth();
  const { user } = useUser();
  const paidUser = has({ plan: "pro" });

  const [consultationCount, setConsultationCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchConsultations = async () => {
      try {
        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) return;

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/consultation/all?email=${email}`
        );
        if (!res.ok) throw new Error("Failed to fetch consultations");
        const data = await res.json();

        if (data.consultations) {
          setHistory(data.consultations);
          setConsultationCount(data.consultations.length);
        }
      } catch (err) {
        console.error("Error fetching consultations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [user]);

  // Flag to disable specialist buttons if first consultation done & user not paid
  const hasAnyConsultationDone = !paidUser && consultationCount >= 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <DashboardHeader />

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 mx-4 sm:mx-6">
        <h2 className="font-bold text-2xl text-center sm:text-left mb-2 sm:mb-0">
          My Dashboard
        </h2>
        {/* First consultation button */}
        <AddSymptom disabled={hasAnyConsultationDone} />
      </div>

      <div className="px-6 mt-6 space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">
            Loading consultation history...
          </p>
        ) : history.length === 0 ? (
          <div className="w-full px-6 py-6">
            <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto text-center">
              <img
                src="/noconsultation.png"
                alt="No Consultations"
                className="w-20 h-20 mb-3 opacity-70 mx-auto"
              />
              <h2 className="font-bold text-xl mt-1">No Consultation Found</h2>
              <p className="text-gray-600 text-sm mt-1">
                You don’t have any consultations yet.
              </p>
              <br />
              <AddSymptom disabled={hasAnyConsultationDone} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto">
            <HistoryTable consultations={history} />
          </div>
        )}

        {/* Pass global consultation flag to all doctors */}
        <DoctorsAgentList hasAnyConsultationDone={hasAnyConsultationDone} />
      </div>
    </div>
  );
}
