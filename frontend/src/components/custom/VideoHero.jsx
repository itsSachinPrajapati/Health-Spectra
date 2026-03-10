import React, { useRef, useEffect } from "react";

function HeroVideoSection() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-gradient-to-b from-blue-100 via-white/90 to-white flex items-center justify-center px-6 md:px-16">
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-7xl mx-auto py-12">
        
        {/* Left: Video Card */}
        <div className="relative bg-white p-4 rounded-2xl shadow-xl hover:scale-105 transform transition-all duration-500">
          <video
            ref={videoRef}
            src="/health.mp4"
            className="w-full rounded-xl shadow-lg hover:rotate-1 transition-transform duration-500"
            autoPlay
            loop
            playsInline
            muted
          />
        </div>

        {/* Right: Text Content */}
        <div className="flex flex-col gap-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Your AI Doctor <br /> Smarter Healthcare at Your Fingertips
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
            Experience intelligent health insights, personalized suggestions,
            and instant guidance powered by advanced AI. Always here to assist
            you, 24/7.
          </p>
          <div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroVideoSection;
