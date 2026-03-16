import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

function AddSymptom({ disabled }) {
  const { user } = useUser();
  const userEmail =
    user?.primaryEmailAddress?.emailAddress || "anonymous@example.com";

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiDoctor, setAiDoctor] = useState(null);
  const [humanDoctors, setHumanDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleFindDoctors = async () => {
    setLoading(true);
    setAiDoctor(null);
    setHumanDoctors([]);
    setSelectedDoctor(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/match-doctor `, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: note }),
      });
      const data = await res.json();
      console.log("API Response:", data); // Debug log
      
      // Combine AI doctor and human doctors into one array for display
      const allDoctors = [];
      
      if (data.ai_doctor && data.ai_doctor.length > 0) {
        allDoctors.push(...data.ai_doctor);
        setAiDoctor(data.ai_doctor[0]);
      }
      
      if (data.human_doctors && data.human_doctors.length > 0) {
        allDoctors.push(...data.human_doctors);
        setHumanDoctors(data.human_doctors);
      }
      
      if (allDoctors.length > 0) {
        // Set doctors state for display
        setDoctors(allDoctors);
      } else {
        setMessage({ text: "No matching doctor found.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Error finding doctors.", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  // Add this state to track all doctors for display
  const [doctors, setDoctors] = useState([]);

  const handleStartConsultation = async () => {
    if (!selectedDoctor) return;

    if (selectedDoctor.type === "AI") {
      // AI Doctor: start AI consultation and redirect to medical agent
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/save-consultation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notes: note,
            selected_doctor: selectedDoctor.specialist,
            doctor_image: selectedDoctor.image,
            email: userEmail,
          }),
        });

        const data = await res.json();
        if (data.success && data.session_id) {
          setMessage({
            text: `✅ Consultation started with ${selectedDoctor.specialist}`,
            type: "success",
          });
          setTimeout(() => {
            setMessage({ text: "", type: "" });
            navigate(`/medical-agent/${data.session_id}`);
          }, 1000);
        } 
        
        else {
          setMessage({
            text: data.error || "Failed to save consultation.",
            type: "error",
          });
        }

      } catch (err) {
        console.error(err);
        setMessage({ text: "Error saving consultation.", type: "error" });
      } finally {
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      }
    } else if (selectedDoctor.type === "Human") {
      // Human Doctor: redirect to booking page
      navigate(`/book-appointment`);
    }
  };

  const resetAll = () => {
    setNote("");
    setDoctors([]);
    setAiDoctor(null);
    setHumanDoctors([]);
    setSelectedDoctor(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-black hover:bg-gray-800 text-white rounded-md px-6 py-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          + Consult with Doctor
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add Basic Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            Add symptoms and other details to get started with the consultation.
          </DialogDescription>
        </DialogHeader>

        {message.text && (
          <div
            className={`p-3 mb-3 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <Textarea
          placeholder="Enter your symptoms here..."
          className="mt-4 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setSelectedDoctor(null);
          }}
        />

        {doctors.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Recommended Doctors:</p>
            <div className="space-y-2">
              {doctors.map((d, i) => (
                <div
                  key={i}
                  className={`flex gap-3 items-center p-3 rounded-lg border cursor-pointer ${
                    selectedDoctor === d
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                  onClick={() => setSelectedDoctor(d)}
                >
                  <img
                    src={d.image}
                    alt={d.specialist}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-semibold flex items-center gap-2">
                      {d.name || d.specialist}{" "}
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          d.type === "AI"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {d.type}
                      </span>
                    </p>
                    <p className="text-gray-500 text-sm">{d.description}</p>
                    {d.name && (
                      <p className="text-xs text-gray-400 mt-1">{d.specialist}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(note.trim() || doctors.length > 0) && (
          <div className="mt-4 flex justify-between gap-2">
            <Button variant="outline" className="flex-1" onClick={resetAll}>
              Cancel
            </Button>

            {selectedDoctor ? (
              <Button
                onClick={handleStartConsultation}
                className="flex-1 bg-black hover:bg-gray-800 text-white"
              >
                {selectedDoctor.type === "AI"
                  ? "Start Consultation"
                  : "Book Appointment"}
              </Button>
            ) : (
              note.trim() && (
                <Button
                  disabled={loading}
                  onClick={handleFindDoctors}
                  className="flex-1 bg-black hover:bg-gray-800 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Finding
                      doctor...
                    </>
                  ) : (
                    "Find Doctor"
                  )}
                </Button>
              )
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AddSymptom;