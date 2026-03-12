import React from "react";
import {Button} from "../components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import AddSymptom from "../components/custom/AddSymptom";

export default function DoctorCard({ doctor, hasAnyConsultationDone }) {
  const { has } = useAuth();
  const paidUser = has({ plan: "pro" });

  if (!doctor) return null;

  // Enable button if first consultation OR paid user OR general physician
  const isButtonEnabled =
    !hasAnyConsultationDone || paidUser || doctor.specialist === "General Physician";

  return (
    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center min-h-[300px] justify-between">
      <div className="flex flex-col items-center">
        <img
          src={doctor.image}
          alt={doctor.specialist || "AI Doctor"}
          className="w-20 h-20 rounded-full mb-4 object-cover"
        />
        <h3 className="text-lg font-semibold mt-2">{doctor.specialist}</h3>
        <p className="text-gray-600 text-sm mt-2">{doctor.description}</p>
      </div>

      <Button
        className="bg-black hover:bg-gray-800 text-white rounded-md px-6 py-2 shadow-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!isButtonEnabled}
      >
        <AddSymptom disabled={!isButtonEnabled} />
      </Button>
    </div>
  );
}
