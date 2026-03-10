import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardHeader from "../PatientDashboard/DashboardHeader";
import { Circle, PhoneCall, PhoneOff } from "lucide-react";
import { AIDoctorAgents } from "../Doctor/DoctorList.jsx";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";

function MedicalVoiceAgent({ currentUser }) {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState(null);
  const [callStarted, setCallStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [messages, setMessages] = useState(""); // raw text
  const [loading, setLoading] = useState(false);

  const timerRef = useRef(null);
  const vapiRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch consultation
  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/consultation/${sessionId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) {
          setConsultation(data.consultation);
          setMessages(data.consultation.notes || "");
        }
      } catch (err) {
        console.error("Error fetching consultation:", err);
      }
    };
    fetchConsultation();
  }, [sessionId]);

  // Setup Vapi and handle live messages
  useEffect(() => {
    const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);
    vapiRef.current = vapi;

    const handleCallStart = () => {
      setCallStarted(true);
      setTime(0);
      timerRef.current = setInterval(() => setTime(prev => prev + 1), 1000);
    };

    const handleCallEnd = () => {
      setCallStarted(false);
      clearInterval(timerRef.current);
      setTime(0);
    };

    const handleMessage = (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setMessages(prev => prev ? prev + "\n" + message.transcript : message.transcript);
      }
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);

    return () => {
      vapi.stop();
      clearInterval(timerRef.current);
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("message", handleMessage);
    };
  }, []);

  useEffect(scrollToBottom, [messages]);

  const doctorInfo = consultation
    ? AIDoctorAgents.find(d => d.specialist === consultation.selected_doctor)
    : null;

  const startCall = () => {
    vapiRef.current?.start(import.meta.env.VITE_VAPI_ASSISTANT_ID);
  };

  const disconnectCall = async () => {
    if (!vapiRef.current) return;

    vapiRef.current.stop();
    setCallStarted(false);
    clearInterval(timerRef.current);
    setTime(0);
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/end-consultation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages, // raw text
          session_id: sessionId,
        }),
      });

      const result = await res.json();
      if (result?.success) {
        setConsultation(prev => ({ ...prev, report: result.report }));
      }

    } catch (err) {
      console.error("Error saving consultation:", err);
    } finally {
      setLoading(false);
      navigate("/dashboard");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
        {/* Connection Status */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex items-center gap-2 px-4 py-1 border rounded-md text-gray-700">
            <Circle className={`h-5 w-5 ${callStarted ? "text-green-500" : "text-red-500"}`} />
            {callStarted ? "Connected" : "Not Connected"}
          </h2>
          <h2 className="font-bold text-xl text-gray-600 px-4 py-1">{formatTime(time)}</h2>
        </div>

        {/* Doctor Info */}
        {doctorInfo && (
          <div className="flex flex-col items-center mb-4">
            <img src={doctorInfo.image} alt={doctorInfo.specialist}
                 className="w-32 h-32 rounded-full border-2 border-gray-200 shadow-md mb-3" />
            <p className="font-semibold text-lg">{doctorInfo.specialist}</p>
            <p className="text-gray-500 text-sm text-center max-w-xs">{doctorInfo.description}</p>
          </div>
        )}

        {/* Messages Box */}
        <div className="h-80 overflow-y-auto p-4 mb-4 border rounded-md bg-gray-50 flex flex-col gap-2">
          {messages.split("\n").map((msg, i) => (
            <div key={i} className="text-gray-900 bg-gray-200 px-4 py-2 rounded-lg shadow-sm break-words">
              {msg}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Call Button */}
        <div className="flex justify-center">
          {!callStarted ? (
            <Button className="flex items-center gap-2 px-6 py-3 text-white bg-black hover:bg-blue-700"
                    onClick={startCall}>
              <PhoneCall className="h-5 w-5" /> Start Call
            </Button>
          ) : (
            <Button variant="destructive" className="flex items-center gap-2 px-6 py-3"
                    onClick={disconnectCall} disabled={loading}>
              <PhoneOff /> Disconnect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalVoiceAgent;
