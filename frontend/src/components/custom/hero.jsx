import React, { useState, useEffect, useRef } from "react";
import {
  Phone, Image, FileText, Calendar, Stethoscope, Shield, Clock,
  Users, ChevronRight, Play, Activity, Brain, Search, Heart,
  Lock, Zap, Star, ArrowRight, CheckCircle, Microscope, Pill,
  TrendingUp, Globe, Award, MessageSquare, BarChart2, Eye
} from "lucide-react";

const COLORS = {
  navy: "#0A0F2C",
  navyMid: "#111936",
  navyLight: "#1B2650",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  goldPale: "#F5E8C0",
  cream: "#F9F6EE",
  white: "#FFFFFF",
  muted: "#8A94B2",
  accent: "#4F6FFF",
  teal: "#00C9B1",
};

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const Badge = ({ children, style = {} }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.35)",
    color: COLORS.goldLight, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
    padding: "5px 14px", borderRadius: 100, textTransform: "uppercase", ...style
  }}>{children}</span>
);

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handler = () => {
      setScrollY(window.scrollY);
      setNavVisible(window.scrollY < lastScroll || window.scrollY < 80);
      setLastScroll(window.scrollY);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [lastScroll]);

  const features = [
    {
      icon: <Phone size={22} />, title: "AI Video Consultation",
      description: "Speak with an AI-powered medical assistant face-to-face, 24 hours a day.",
      details: "Real-time video sessions powered by advanced medical language models. Ask questions, discuss symptoms, and get structured guidance — with full conversation history and session summaries.",
      status: "Coming Soon", statusColor: COLORS.muted,
    },
    {
      icon: <Eye size={22} />, title: "Visual Disease Analysis",
      description: "Photograph a concern and receive an AI-powered visual assessment instantly.",
      details: "Upload photos of skin conditions, lesions, rashes, or wounds. Our computer vision model identifies patterns, suggests possible diagnoses, and recommends next steps.",
      status: "Beta", statusColor: COLORS.teal,
    },
    {
      icon: <FileText size={22} />, title: "Medical Report Decoder",
      description: "Translate complex lab results and clinical documents into plain language.",
      details: "Upload PDFs, images, or text of your medical reports. Get plain-English summaries, trend highlights, flagged anomalies, and actionable follow-up suggestions.",
      status: "Live", statusColor: COLORS.goldLight,
    },
    {
      icon: <Calendar size={22} />, title: "Smart Appointment Booking",
      description: "Find and schedule appointments with verified specialists near you.",
      details: "AI-matched recommendations based on your health profile. Filter by specialty, language, insurance, and availability. Instant confirmations with calendar sync.",
      status: "Coming Soon", statusColor: COLORS.muted,
    },
  ];

  const stats = [
    { label: "AI Features", value: "4+", sub: "& growing" },
    { label: "Availability", value: "24/7", sub: "always on" },
    { label: "Report Types", value: "50+", sub: "supported" },
    { label: "Access", value: "Free", sub: "early access" },
  ];

  const trustItems = [
    { icon: <Shield size={20} />, title: "HIPAA-Aligned Design", desc: "Built from the ground up with privacy and compliance as core principles." },
    { icon: <Lock size={20} />, title: "End-to-End Encrypted", desc: "Your health data is encrypted in transit and at rest. Always." },
    { icon: <Zap size={20} />, title: "Instant Responses", desc: "Sub-second AI inference so you never wait for the insights you need." },
    { icon: <Globe size={20} />, title: "Available Anywhere", desc: "Browser-based. No app downloads. Works on any device, worldwide." },
  ];

  const testimonials = [
    { name: "Dr. Priya Mehta", role: "General Physician", text: "The report decoder saves my patients so much anxiety. They come in already understanding their results.", avatar: "PM" },
    { name: "Rohan Desai", role: "Early Access User", text: "I uploaded a skin photo and got a clear explanation within seconds. Absolutely remarkable for a new platform.", avatar: "RD" },
    { name: "Aisha Kapoor", role: "Healthcare Researcher", text: "The architecture and approach here is unlike anything I've seen from a newly launched health tech product.", avatar: "AK" },
  ];

  const faqItems = [
    { q: "Is this a substitute for a real doctor?", a: "No. Our platform provides AI-generated information and insights to help you understand your health better. Always consult a licensed physician for diagnosis and treatment." },
    { q: "How is my health data stored?", a: "All data is encrypted end-to-end. We do not sell or share personal health information. You can delete your data at any time." },
    { q: "Which report formats are supported?", a: "We currently support PDF, JPG, PNG, and plain text. More formats including DICOM are in development." },
    { q: "Is early access really free?", a: "Yes — during the launch phase, core features are completely free. Premium tiers with advanced features will be introduced later." },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: COLORS.navy, color: COLORS.white, fontFamily: "'Georgia', 'Times New Roman', serif", overflowX: "hidden" }}>

      {/* ── Google Font Import via style tag ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.navy}; }
        .display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .body-font { font-family: 'DM Sans', system-ui, sans-serif; }
        .gold-text { background: linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .card-hover { transition: transform 0.35s ease, box-shadow 0.35s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.4); }
        .btn-primary { background: linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight}); color: ${COLORS.navy}; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 0.06em; padding: 14px 32px; border: none; border-radius: 6px; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(201,168,76,0.4); }
        .btn-ghost { background: transparent; color: ${COLORS.goldLight}; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px; letter-spacing: 0.06em; padding: 13px 28px; border: 1.5px solid rgba(201,168,76,0.4); border-radius: 6px; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px; }
        .btn-ghost:hover { border-color: ${COLORS.goldLight}; background: rgba(201,168,76,0.08); transform: translateY(-2px); }
        .divider-gold { height: 1px; background: linear-gradient(90deg, transparent, ${COLORS.gold}, transparent); border: none; }
        .noise-bg::after { content: ''; position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events: none; }
        input:focus { outline: none; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .float-anim { animation: float 6s ease-in-out infinite; }
        .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: ${COLORS.teal}; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        .feature-card-active { border-color: ${COLORS.gold} !important; background: rgba(201,168,76,0.06) !important; }
        hr.divider-gold { height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent); border: none; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 40 ? "rgba(10,15,44,0.95)" : "transparent",
        backdropFilter: scrollY > 40 ? "blur(20px)" : "none",
        borderBottom: scrollY > 40 ? "1px solid rgba(201,168,76,0.12)" : "none",
        transition: "all 0.4s ease",
        transform: navVisible ? "translateY(0)" : "translateY(-100%)",
        padding: "0 40px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Stethoscope size={18} color={COLORS.navy} />
            </div>
            <span className="display" style={{ fontSize: 22, fontWeight: 600, color: COLORS.white, letterSpacing: "0.02em" }}>HealthSpectra<span className="gold-text">AI</span></span>
          </div>
          <div className="body-font" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {["Features", "How it Works", "Trust & Safety"].map(item => (
              <a key={item} href="#" style={{ color: COLORS.muted, fontSize: 13, fontWeight: 500, textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = COLORS.goldLight}
                onMouseLeave={e => e.target.style.color = COLORS.muted}>{item}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-ghost" style={{ padding: "9px 20px", fontSize: 13 }} onClick={() => window.location.href='/sign-in'}>Log in</button>
            <button className="btn-primary" style={{ padding: "9px 20px", fontSize: 13 }} onClick={() => window.location.href='/sign-in'}>Get Early Access</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="noise-bg" style={{
        position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "120px 40px 80px", overflow: "hidden",
        background: `radial-gradient(ellipse 80% 60% at 60% 40%, rgba(79,111,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 70%, rgba(201,168,76,0.06) 0%, transparent 60%), ${COLORS.navy}`,
      }}>
        {/* Decorative rings */}
        <div style={{ position: "absolute", top: "50%", right: "8%", transform: "translateY(-50%)", width: 480, height: 480, border: "1px solid rgba(201,168,76,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "50%", right: "8%", transform: "translateY(-50%)", width: 360, height: 360, border: "1px solid rgba(201,168,76,0.12)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "50%", right: "8%", transform: "translateY(-50%)", width: 240, height: 240, border: "1px solid rgba(201,168,76,0.18)", borderRadius: "50%" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* Left */}
          <div>
            <Reveal delay={0}>
              <Badge><span className="pulse-dot" style={{ display: "inline-block" }}></span> Early Access Now Open</Badge>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="display" style={{ fontSize: "clamp(42px, 5vw, 70px)", fontWeight: 600, lineHeight: 1.1, marginTop: 24, color: COLORS.white, letterSpacing: "-0.01em" }}>
                Healthcare,<br />
                <span className="gold-text">Reimagined</span><br />
                <span style={{ fontWeight: 300, fontStyle: "italic", color: COLORS.muted }}>by Artificial Intelligence</span>
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="body-font" style={{ color: COLORS.muted, fontSize: 17, lineHeight: 1.75, marginTop: 24, maxWidth: 480 }}>
                HealthSpectra is a new intelligent health platform that puts clinical-grade AI tools in your hands — for understanding reports, analysing symptoms, and accessing care.
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
                <button className="btn-primary" onClick={() => window.location.href='/sign-in'}>
                  Begin Free Access <ArrowRight size={16} />
                </button>
                <button className="btn-ghost">
                  <Play size={14} /> Watch Demo
                </button>
              </div>
            </Reveal>
            <Reveal delay={480}>
              <div style={{ display: "flex", gap: 32, marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                {stats.map((s, i) => (
                  <div key={i}>
                    <div className="display gold-text" style={{ fontSize: 30, fontWeight: 600 }}>{s.value}</div>
                    <div className="body-font" style={{ color: COLORS.muted, fontSize: 12, marginTop: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
                    <div className="body-font" style={{ color: "rgba(138,148,178,0.6)", fontSize: 11 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — Visual */}
          <Reveal delay={200} className="float-anim" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 380, height: 380 }}>
              {/* Main card */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 24,
                background: `linear-gradient(145deg, ${COLORS.navyLight}, ${COLORS.navyMid})`,
                border: "1px solid rgba(201,168,76,0.2)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40,
              }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px rgba(201,168,76,0.3)` }}>
                  <Stethoscope size={36} color={COLORS.navy} />
                </div>
                <div className="display" style={{ fontSize: 22, fontWeight: 600, textAlign: "center", color: COLORS.white }}>Your Health<br />Intelligence Layer</div>
                <div className="body-font" style={{ fontSize: 13, color: COLORS.muted, textAlign: "center", lineHeight: 1.6 }}>Powered by state-of-the-art<br />medical AI models</div>

                {/* Live chips */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
                  {["Reports", "Vision AI", "Booking", "Video"].map((t, i) => (
                    <span key={i} className="body-font" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", color: COLORS.goldLight, fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <div style={{ position: "absolute", top: -16, left: -20, background: COLORS.navyLight, border: "1px solid rgba(0,201,177,0.4)", borderRadius: 12, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                <Activity size={14} color={COLORS.teal} />
                <span className="body-font" style={{ fontSize: 11, color: COLORS.teal, fontWeight: 700 }}>AI Analysis Active</span>
              </div>
              <div style={{ position: "absolute", bottom: -16, right: -20, background: COLORS.navyLight, border: "1px solid rgba(201,168,76,0.3)", borderRadius: 12, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                <Shield size={14} color={COLORS.gold} />
                <span className="body-font" style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700 }}>Privacy-First Design</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold})`, padding: "12px 0", overflow: "hidden" }}>
        <div className="body-font" style={{ display: "flex", gap: 48, color: COLORS.navy, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          {Array(4).fill(["✦ New Platform", "AI-Powered", "Report Analysis", "Visual Diagnostics", "24/7 Access", "Free Early Access", "HIPAA-Aligned"]).flat().map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ padding: "120px 40px", background: COLORS.navyMid }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <Badge>Platform Features</Badge>
              <h2 className="display" style={{ fontSize: "clamp(32px,4vw,54px)", fontWeight: 600, marginTop: 20, color: COLORS.white, letterSpacing: "-0.01em" }}>
                Four pillars of <span className="gold-text">AI-powered care</span>
              </h2>
              <p className="body-font" style={{ color: COLORS.muted, fontSize: 16, marginTop: 16, maxWidth: 540, margin: "16px auto 0" }}>
                A new kind of health platform built around the tools you actually need.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`card-hover ${activeFeature === i ? "feature-card-active" : ""}`}
                  onMouseEnter={() => setActiveFeature(i)}
                  style={{
                    background: activeFeature === i ? "rgba(201,168,76,0.06)" : COLORS.navyLight,
                    border: `1px solid ${activeFeature === i ? COLORS.gold : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 16, padding: "22px 24px", cursor: "pointer", transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: activeFeature === i ? `rgba(201,168,76,0.15)` : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: activeFeature === i ? COLORS.goldLight : COLORS.muted, flexShrink: 0 }}>
                      {f.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h3 className="body-font" style={{ fontSize: 16, fontWeight: 600, color: COLORS.white }}>{f.title}</h3>
                        <span className="body-font" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: f.statusColor, background: `${f.statusColor}18`, border: `1px solid ${f.statusColor}40`, padding: "3px 9px", borderRadius: 20 }}>{f.status}</span>
                      </div>
                      <p className="body-font" style={{ color: COLORS.muted, fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>{f.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature detail */}
            <Reveal delay={100}>
              <div style={{
                background: `linear-gradient(145deg, ${COLORS.navyLight}, rgba(27,38,80,0.4))`,
                border: "1px solid rgba(201,168,76,0.15)", borderRadius: 24, padding: 48,
                minHeight: 380, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center",
                boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
              }}>
                <div style={{ width: 72, height: 72, borderRadius: 18, background: `linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08))`, border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.goldLight, marginBottom: 24 }}>
                  {features[activeFeature].icon && React.cloneElement(features[activeFeature].icon, { size: 30 })}
                </div>
                <h3 className="display" style={{ fontSize: 26, fontWeight: 600, color: COLORS.white, marginBottom: 16 }}>{features[activeFeature].title}</h3>
                <p className="body-font" style={{ color: COLORS.muted, fontSize: 15, lineHeight: 1.75, marginBottom: 28 }}>{features[activeFeature].details}</p>
                <span className="body-font" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: features[activeFeature].statusColor, background: `${features[activeFeature].statusColor}15`, border: `1px solid ${features[activeFeature].statusColor}35`, padding: "5px 16px", borderRadius: 20 }}>
                  Status: {features[activeFeature].status}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "120px 40px", background: COLORS.navy }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <Badge>Process</Badge>
              <h2 className="display" style={{ fontSize: "clamp(32px,4vw,54px)", fontWeight: 600, marginTop: 20, color: COLORS.white }}>
                From question to <span className="gold-text">clarity in minutes</span>
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, position: "relative" }}>
            {/* Connecting line */}
            <div style={{ position: "absolute", top: 52, left: "18%", right: "18%", height: 1, background: `linear-gradient(90deg, ${COLORS.gold}60, ${COLORS.goldLight}60)`, zIndex: 0 }} />

            {[
              { num: "01", icon: <Users size={24} />, title: "Create Your Profile", desc: "Sign up in under 60 seconds. Share relevant health context so our AI can personalise your experience from day one." },
              { num: "02", icon: <Brain size={24} />, title: "AI Processes Your Data", desc: "Upload a report, image, or describe your symptoms. Our models analyse, cross-reference, and generate structured insights." },
              { num: "03", icon: <CheckCircle size={24} />, title: "Receive Clear Guidance", desc: "Get plain-language explanations, flagged concerns, and recommended next steps — all in your personal health dashboard." },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="card-hover" style={{
                  background: COLORS.navyLight, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "36px 28px", textAlign: "center", position: "relative", zIndex: 1,
                }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: `0 0 24px rgba(201,168,76,0.3)` }}>
                    <span className="display" style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy }}>{step.num}</span>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.goldLight, margin: "0 auto 16px" }}>
                    {step.icon}
                  </div>
                  <h3 className="body-font" style={{ fontSize: 17, fontWeight: 700, color: COLORS.white, marginBottom: 12 }}>{step.title}</h3>
                  <p className="body-font" style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST & SAFETY ── */}
      <section style={{ padding: "120px 40px", background: COLORS.navyMid }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Badge>Trust & Safety</Badge>
              <h2 className="display" style={{ fontSize: "clamp(32px,4vw,54px)", fontWeight: 600, marginTop: 20, color: COLORS.white }}>
                Built to earn your <span className="gold-text">complete confidence</span>
              </h2>
              <p className="body-font" style={{ color: COLORS.muted, fontSize: 16, marginTop: 14, maxWidth: 520, margin: "14px auto 0" }}>
                We apply the same rigour to our data practices as clinicians apply to patient care.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {trustItems.map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="card-hover" style={{ background: COLORS.navyLight, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "28px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.goldLight, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <h4 className="body-font" style={{ fontSize: 15, fontWeight: 700, color: COLORS.white, marginBottom: 6 }}>{item.title}</h4>
                    <p className="body-font" style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.65 }}>{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Disclaimer */}
          <Reveal delay={200}>
            <div style={{ marginTop: 40, padding: "20px 28px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 12, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <Shield size={16} style={{ color: COLORS.goldLight, flexShrink: 0, marginTop: 2 }} />
              <p className="body-font" style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.7 }}>
                <strong style={{ color: COLORS.goldLight }}>Medical Disclaimer: </strong>
                HealthSpectra provides AI-generated information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "120px 40px", background: COLORS.navy }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Badge>Early Voices</Badge>
              <h2 className="display" style={{ fontSize: "clamp(32px,4vw,54px)", fontWeight: 600, marginTop: 20, color: COLORS.white }}>
                Trusted by those who <span className="gold-text">tried it first</span>
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="card-hover" style={{ background: COLORS.navyLight, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                    {Array(5).fill(0).map((_, j) => <Star key={j} size={13} fill={COLORS.gold} color={COLORS.gold} />)}
                  </div>
                  <p className="body-font" style={{ color: "#C0C8E0", fontSize: 14, lineHeight: 1.75, fontStyle: "italic", marginBottom: 24 }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="body-font" style={{ fontSize: 12, fontWeight: 700, color: COLORS.navy }}>{t.avatar}</span>
                    </div>
                    <div>
                      <div className="body-font" style={{ fontSize: 13, fontWeight: 700, color: COLORS.white }}>{t.name}</div>
                      <div className="body-font" style={{ fontSize: 11, color: COLORS.muted }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "100px 40px", background: COLORS.navyMid }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge>FAQ</Badge>
              <h2 className="display" style={{ fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 600, marginTop: 20, color: COLORS.white }}>
                Common <span className="gold-text">questions</span>
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqItems.map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div
                  style={{ background: COLORS.navyLight, border: `1px solid ${openFaq === i ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.3s" }}
                >
                  <button
                    className="body-font"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", background: "none", border: "none", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", color: COLORS.white, fontSize: 15, fontWeight: 600, cursor: "pointer", textAlign: "left" }}
                  >
                    {item.q}
                    <ChevronRight size={16} style={{ color: COLORS.goldLight, transform: openFaq === i ? "rotate(90deg)" : "none", transition: "transform 0.3s", flexShrink: 0 }} />
                  </button>
                  {openFaq === i && (
                    <div className="body-font" style={{ padding: "0 24px 20px", color: COLORS.muted, fontSize: 14, lineHeight: 1.75 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "120px 40px", position: "relative", overflow: "hidden",
        background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.1) 0%, transparent 70%), ${COLORS.navy}`,
      }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, border: "1px solid rgba(201,168,76,0.06)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 400, border: "1px solid rgba(201,168,76,0.1)", borderRadius: "50%" }} />
        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Badge>Limited Early Access</Badge>
            <h2 className="display" style={{ fontSize: "clamp(36px,5vw,64px)", fontWeight: 600, marginTop: 24, color: COLORS.white, lineHeight: 1.1 }}>
              Experience health AI<br /><span className="gold-text">before everyone else</span>
            </h2>
            <p className="body-font" style={{ color: COLORS.muted, fontSize: 16, marginTop: 20, lineHeight: 1.75 }}>
              Join the founding cohort of users shaping the future of AI-powered healthcare. Free access. Full features. No credit card.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ fontSize: 15, padding: "16px 40px" }} onClick={() => window.location.href='/sign-in'}>
                Get Early Access — It's Free <ArrowRight size={16} />
              </button>
            </div>
            <div className="body-font" style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 28, color: COLORS.muted, fontSize: 12 }}>
              {["No credit card required", "Cancel anytime", "Privacy-first platform"].map((t, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}><CheckCircle size={12} color={COLORS.gold} /> {t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#050912", borderTop: "1px solid rgba(201,168,76,0.1)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 40px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Stethoscope size={18} color={COLORS.navy} />
                </div>
                <span className="display" style={{ fontSize: 22, fontWeight: 600, color: COLORS.white }}>Medica<span className="gold-text">AI</span></span>
              </div>
              <p className="body-font" style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.8, maxWidth: 280 }}>
                A new generation of AI-powered health tools, built to help people understand and navigate their healthcare journey with clarity and confidence.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                {["f", "x", "in", "ig"].map((s, i) => (
                  <div key={i} style={{ width: 36, height: 36, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.15)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
                    <span className="body-font" style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              { heading: "Features", links: ["AI Consultation", "Image Analysis", "Report Decoder", "Appointments"] },
              { heading: "Company", links: ["About Us", "How It Works", "Privacy Policy", "Terms of Service"] },
              { heading: "Support", links: ["Help Centre", "Contact Us", "Status Page", "Feedback"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="body-font" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: COLORS.goldLight, textTransform: "uppercase", marginBottom: 20 }}>{col.heading}</h4>
                <ul style={{ listStyle: "none" }}>
                  {col.links.map((link, j) => (
                    <li key={j} style={{ marginBottom: 10 }}>
                      <a href="#" className="body-font" style={{ color: COLORS.muted, fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => e.target.style.color = COLORS.white}
                        onMouseLeave={e => e.target.style.color = COLORS.muted}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 40, marginBottom: 40, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
            <div>
              <h4 className="display" style={{ fontSize: 20, fontWeight: 600, color: COLORS.white, marginBottom: 6 }}>Stay informed</h4>
              <p className="body-font" style={{ color: COLORS.muted, fontSize: 13 }}>Get product updates, new feature announcements, and health AI insights.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <input type="email" placeholder="Your email address" className="body-font" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 18px", color: COLORS.white, fontSize: 13, width: 240 }} />
              <button className="btn-primary" style={{ padding: "12px 20px", fontSize: 13 }}>Subscribe</button>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <span className="body-font" style={{ color: COLORS.muted, fontSize: 12 }}>© 2025 HealthSpectra. All rights reserved.</span>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="body-font">
                <span className="pulse-dot"></span>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>All systems operational</span>
              </div>
              <span className="body-font" style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.muted, fontSize: 12 }}>
                <Shield size={12} color={COLORS.gold} /> HIPAA-Aligned Design
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}