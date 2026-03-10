import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import HistoryTable from "./HistoryTable.jsx";
import AddSymptom from "../components/custom/AddSymptom.jsx";

export default function HistoryPage() {
  const { user } = useUser();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (email) fetchHistory(email);
  }, [user]);

  const fetchHistory = async (email) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/consultation/all?email=${email}`);
      const data = await res.json();
      if (data.success) setHistory(data.consultations || []);
      else console.error("Failed to fetch history:", data.error);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-6 py-6 text-center">
        <p className="text-gray-500">Loading consultation history...</p>
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="w-full px-6 py-6">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto text-center">
          <img
            src="noconsultation.png"
            alt="No Consultations"
            className="w-24 h-24 mb-3 opacity-70 mx-auto"
          />
          <h2 className="font-bold text-xl mt-1">No Recent Consultation</h2>
          <p className="text-gray-600 text-sm mt-1 mb-3">
            It looks like you haven't had any consultations yet. Start your health journey with us today!
          </p>
          <AddSymptom />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto">
        <h2 className="font-bold text-2xl mb-4 text-center">Your Consultation History</h2>
        <HistoryTable consultations={history} />
      </div>
    </div>
  );
}


