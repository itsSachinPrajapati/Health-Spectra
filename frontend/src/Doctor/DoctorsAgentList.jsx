import React from "react";
import DoctorCard from "./DoctorCard";
import { AIDoctorAgents } from "./DoctorList";
import { Badge } from "@/components/ui/badge";

export default function DoctorsAgentList({ hasAnyConsultationDone }) {
  if (!Array.isArray(AIDoctorAgents)) return null;

  return (
    <div className="px-2 pb-10">
      <div className="font-bold text-2xl text-center my-10">
        <h2>AI Specialist Doctors</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {AIDoctorAgents.map((doctor) => (
          <div key={doctor.id} className="relative">
            {doctor.specialist !== "General Physician" && (
              <Badge className="absolute top-2 right-2 bg-black text-white border border-black">
                Premium
              </Badge>
            )}
            <DoctorCard
              doctor={doctor}
              hasAnyConsultationDone={hasAnyConsultationDone}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
