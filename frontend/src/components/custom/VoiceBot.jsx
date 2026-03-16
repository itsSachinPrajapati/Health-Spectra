import React, { useState, useRef, useEffect } from "react";
import DashboardHeader from "../../PatientDashboard/DashboardHeader";

export default function VoiceBot() {
  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrlPreview, setAudioUrlPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState(null);
  const [speechText, setSpeechText] = useState("");
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [doctorAudioUrl, setDoctorAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoRef = useRef(null);

  // --- Audio recording ---
  const handleStartStop = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioFile(audioBlob);
        setAudioUrlPreview(URL.createObjectURL(audioBlob));
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleRemoveAudio = () => {
    setAudioFile(null);
    setAudioUrlPreview(null);
  };
  const handleRemoveImage = () => {
    setImageFile(null);
    setCapturedImageUrl(null);
  };

  // --- Camera ---
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    setCameraStream(stream);
  };

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = cameraStream;
  }, [cameraStream]);

  const capturePhoto = async () => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      const scale = 0.5;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], "camera_capture.png", { type: "image/png" });
        setImageFile(file);
        setCapturedImageUrl(URL.createObjectURL(blob));
      });

      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      alert("Please provide an audio.");
      return;
    }

    setLoading(true);
    setSpeaking(true);
    setSpeechText("");
    setDisplayedResponse("");
    setDoctorAudioUrl("");

    const formData = new FormData();
    formData.append("audio", audioFile, "audio.webm");
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/voicebot`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      setSpeechText(data.speech_to_text || "");
      setDisplayedResponse(data.doctor_response || "");
      setDoctorAudioUrl(data.voice_base64 ? "data:audio/mp3;base64," + data.voice_base64 : "");
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Error contacting the doctor. See console for details.");
    } finally {
      setLoading(false);
      setSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          AI Doctor with Vision & Voice
        </h1>

        {/* Audio */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Live Microphone</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleStartStop}
              className={`px-5 py-2 rounded-full text-white font-medium transition ${
                recording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {recording ? "Stop Listening" : "Start Listening"}
            </button>
            {recording && (
              <span className="text-red-500 font-bold animate-pulse">● Recording</span>
            )}
          </div>
          {audioUrlPreview && (
            <div className="flex flex-col space-y-2 mt-2">
              <audio src={audioUrlPreview} controls className="w-full rounded" />
              <button
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 self-start"
                onClick={handleRemoveAudio}
              >
                Re-record
              </button>
            </div>
          )}
        </div>

        {/* Camera */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Upload Image or Capture Photo</h2>
          <input
            type="file"
            accept="image/*"
            className="border border-gray-300 rounded p-2"
            onChange={(e) => {
              setImageFile(e.target.files[0]);
              setCapturedImageUrl(URL.createObjectURL(e.target.files[0]));
            }}
          />
          <div className="flex flex-col space-y-2 mt-2">
            {cameraStream ? (
              <video ref={videoRef} autoPlay className="w-64 h-48 rounded shadow-lg" />
            ) : capturedImageUrl ? (
              <img
                src={capturedImageUrl}
                alt="Captured"
                className="w-64 h-48 rounded shadow-lg object-contain"
              />
            ) : (
              <div className="w-64 h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                No Camera Active
              </div>
            )}

            {!cameraStream && !capturedImageUrl && (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 w-fit"
                onClick={startCamera}
              >
                Start Camera
              </button>
            )}

            {cameraStream && (
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  onClick={capturePhoto}
                >
                  Capture Photo
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={() => {
                    cameraStream.getTracks().forEach((track) => track.stop());
                    setCameraStream(null);
                  }}
                >
                  Stop Camera
                </button>
              </div>
            )}

            {capturedImageUrl && (
              <button
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 w-fit"
                onClick={handleRemoveImage}
              >
                Re-capture / Remove
              </button>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit to Doctor"}
          </button>
        </div>

        {/* Results */}
        {(speechText || displayedResponse || doctorAudioUrl) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {speechText && (
              <div>
                <h3 className="font-semibold text-gray-700">Speech to Text</h3>
                <p className="text-gray-800">{speechText}</p>
              </div>
            )}
            {displayedResponse && (
              <div>
                <h3 className="font-semibold text-gray-700">Doctor's Response</h3>
                <p className="text-gray-800">{displayedResponse}</p>
                {speaking && (
                  <div className="flex space-x-2 mt-4 justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping delay-150"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping delay-300"></div>
                  </div>
                )}
              </div>
            )}
            {doctorAudioUrl && (
              <div>
                <h3 className="font-semibold text-gray-700">Doctor's Voice</h3>
                <audio src={doctorAudioUrl} controls autoPlay className="w-full rounded" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
