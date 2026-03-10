import React from "react";
import { Link } from "react-router-dom";
import Header from "../PatientDashboard/DashboardHeader";
import MRIcard from "../components/custom/MRIcard";
import VoiceBotCard from "../components/custom/VoiceBotCard";
import ReportAnalyzerCard from "@/components/custom/Repo";

export default function Tools() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">🛠️ Tools</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* VoiceBot Tool */}
          <Link to="/dashboard/tools/voicebot" className="block hover:scale-105 transition">
            <VoiceBotCard />
          </Link>

          {/* MRI Tool */}
          <Link to="/dashboard/tools/disease-detection" className="block hover:scale-105 transition">
            <MRIcard />
          </Link>

          <ReportAnalyzerCard/>

          
        </div>
      </main>
    </div>
  );
}
