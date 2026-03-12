import { useUser } from "@clerk/clerk-react"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

const steps = [
  { id: 1, label: "Personal Info", icon: "👤" },
  { id: 2, label: "Practice Details", icon: "🏥" },
  { id: 3, label: "Schedule", icon: "🗓️" },
]

export default function DoctorOnboarding() {
  const { user } = useUser()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    experience: "",
    consultation_fee: "",
    phone: "",
    address: "",
    description: "",
    queue_start_time: "",
    queue_end_time: "",
    slot_start_time: "",
    slot_end_time: "",
    slot_duration: "",
  })

  const [image, setImage] = useState(null)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const canProceed = () => {
    if (currentStep === 1) return form.name && form.specialization && form.experience
    if (currentStep === 2) return form.consultation_fee && form.phone
    return true
  }

  const submit = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append("clerk_user_id", user.id)
    Object.keys(form).forEach((key) => formData.append(key, form[key]))
    if (image) formData.append("image", image)

    const res = await fetch("http://127.0.0.1:5000/api/doctors/update-profile", {
      method: "POST",
      body: formData,
    })

    setLoading(false)
    if (res.ok) {
      navigate("/doctor/dashboard")
    } else {
      alert("Profile update failed. Please try again.")
    }
  }

  const specializations = [
    "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
    "Orthopedic", "Pediatrician", "Psychiatrist", "Gynecologist",
    "Ophthalmologist", "ENT Specialist", "Oncologist", "Radiologist", "Other"
  ]

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fafbff 60%, #f0f9f4 100%)" }}>
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .onboard-root { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'Fraunces', serif; }

        .step-card {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 8px 40px rgba(79,114,255,0.08), 0 2px 8px rgba(0,0,0,0.04);
        }

        .field-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e8ecf4;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a2236;
          background: #fafbff;
          transition: all 0.2s ease;
          outline: none;
          box-sizing: border-box;
        }
        .field-input:focus {
          border-color: #4f72ff;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(79,114,255,0.1);
        }
        .field-input::placeholder { color: #a0aabf; }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #6b7694;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .step-indicator {
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600;
          transition: all 0.3s ease;
        }
        .step-active { background: #4f72ff; color: #fff; box-shadow: 0 4px 12px rgba(79,114,255,0.35); }
        .step-done { background: #10b981; color: #fff; }
        .step-pending { background: #eef0f7; color: #a0aabf; }

        .step-line {
          flex: 1; height: 2px; margin: 0 8px; margin-bottom: 22px;
          border-radius: 2px;
          transition: background 0.3s ease;
        }
        .step-line-done { background: #10b981; }
        .step-line-pending { background: #eef0f7; }

        .btn-primary {
          background: linear-gradient(135deg, #4f72ff, #6a5aff);
          color: #fff;
          border: none;
          padding: 13px 32px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(79,114,255,0.3);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(79,114,255,0.4); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .btn-secondary {
          background: #eef0f7;
          color: #4f72ff;
          border: none;
          padding: 13px 24px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-secondary:hover { background: #e2e6f5; }

        .avatar-upload {
          width: 90px; height: 90px;
          border-radius: 50%;
          border: 2.5px dashed #c5ccde;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s;
          flex-shrink: 0;
        }
        .avatar-upload:hover { border-color: #4f72ff; }
        .avatar-upload img { width: 100%; height: 100%; object-fit: cover; }

        .info-badge {
          background: linear-gradient(135deg, #eef3ff, #f0fff8);
          border: 1px solid #d4e0ff;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #4f72ff;
        }

        .section-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 4px 0;
        }
        .section-divider span {
          font-size: 11px; font-weight: 700;
          color: #a0aabf; letter-spacing: 0.1em;
          text-transform: uppercase; white-space: nowrap;
        }
        .section-divider::before, .section-divider::after {
          content: ''; flex: 1; height: 1px; background: #eef0f7;
        }

        .fade-in { animation: fadeSlide 0.35s ease; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        select.field-input { appearance: none; cursor: pointer; }

        textarea.field-input { resize: vertical; line-height: 1.6; }
      `}</style>

      <div className="onboard-root" style={{ maxWidth: 600, margin: "0 auto", padding: "32px 16px 64px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(79,114,255,0.08)", borderRadius: 24,
            padding: "6px 16px", marginBottom: 14,
            fontSize: 13, color: "#4f72ff", fontWeight: 600
          }}>
            <span>🩺</span> Doctor Registration
          </div>
          <h1 className="display-font" style={{ fontSize: 30, fontWeight: 700, color: "#1a2236", margin: 0, lineHeight: 1.2 }}>
            Set Up Your Profile
          </h1>
          <p style={{ color: "#7a84a0", fontSize: 15, marginTop: 8 }}>
            Complete your profile to start accepting patients
          </p>
        </div>

        {/* Step Indicators */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 28, padding: "0 8px" }}>
          {steps.map((step, i) => (
            <div key={step.id} style={{ display: "contents" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div className={`step-indicator ${currentStep === step.id ? "step-active" : currentStep > step.id ? "step-done" : "step-pending"}`}>
                  {currentStep > step.id ? "✓" : step.icon}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: currentStep === step.id ? "#4f72ff" : "#a0aabf", whiteSpace: "nowrap" }}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`step-line ${currentStep > step.id ? "step-line-done" : "step-line-pending"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="step-card" style={{ borderRadius: 20, padding: 32 }}>

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="fade-in">
              <div className="section-divider" style={{ marginBottom: 24 }}>
                <span>Basic Information</span>
              </div>

              {/* Avatar + Name row */}
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div className="avatar-upload" onClick={() => fileInputRef.current?.click()}>
                    {imagePreview
                      ? <img src={imagePreview} alt="preview" />
                      : <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 22 }}>📷</div>
                          <div style={{ fontSize: 10, color: "#a0aabf", marginTop: 2 }}>Photo</div>
                        </div>
                    }
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImage} />
                  <div style={{ fontSize: 10, color: "#a0aabf", textAlign: "center", marginTop: 6 }}>Optional</div>
                </div>

                <div style={{ flex: 1 }}>
                  <label className="field-label">Full Name *</label>
                  <input
                    className="field-input"
                    placeholder="Dr. Rajesh Kumar"
                    value={form.name}
                    onChange={set("name")}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label className="field-label">Specialization *</label>
                  <select className="field-input" value={form.specialization} onChange={set("specialization")}>
                    <option value="">Select...</option>
                    {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Years of Experience *</label>
                  <input
                    className="field-input"
                    placeholder="e.g. 8"
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={set("experience")}
                  />
                </div>
              </div>

              <div>
                <label className="field-label">About You</label>
                <textarea
                  className="field-input"
                  placeholder="Brief description about your expertise, approach to patient care, qualifications..."
                  rows={4}
                  value={form.description}
                  onChange={set("description")}
                />
              </div>
            </div>
          )}

          {/* Step 2: Practice Details */}
          {currentStep === 2 && (
            <div className="fade-in">
              <div className="section-divider" style={{ marginBottom: 24 }}>
                <span>Practice Details</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label className="field-label">Consultation Fee *</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#7a84a0", fontWeight: 600, fontSize: 14, pointerEvents: "none" }}>₹</span>
                    <input
                      className="field-input"
                      placeholder="500"
                      type="number"
                      style={{ paddingLeft: 28 }}
                      value={form.consultation_fee}
                      onChange={set("consultation_fee")}
                    />
                  </div>
                </div>
                <div>
                  <label className="field-label">Phone Number *</label>
                  <input
                    className="field-input"
                    placeholder="+91 98765 43210"
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="field-label">Clinic Address</label>
                <input
                  className="field-input"
                  placeholder="123, MG Road, Mumbai, Maharashtra"
                  value={form.address}
                  onChange={set("address")}
                />
              </div>

              <div className="info-badge">
                💡 Your contact details are only shared with confirmed appointment patients.
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {currentStep === 3 && (
            <div className="fade-in">
              <div className="section-divider" style={{ marginBottom: 24 }}>
                <span>Queue Settings</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label className="field-label">Queue Opens At</label>
                  <input type="time" className="field-input" value={form.queue_start_time} onChange={set("queue_start_time")} />
                </div>
                <div>
                  <label className="field-label">Queue Closes At</label>
                  <input type="time" className="field-input" value={form.queue_end_time} onChange={set("queue_end_time")} />
                </div>
              </div>

              <div className="section-divider" style={{ marginBottom: 24 }}>
                <span>Appointment Slots</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label className="field-label">Slot Start Time</label>
                  <input type="time" className="field-input" value={form.slot_start_time} onChange={set("slot_start_time")} />
                </div>
                <div>
                  <label className="field-label">Slot End Time</label>
                  <input type="time" className="field-input" value={form.slot_end_time} onChange={set("slot_end_time")} />
                </div>
              </div>

              <div style={{ marginBottom: 8 }}>
                <label className="field-label" style={{ marginBottom: 10 }}>Slot Duration</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[10, 15, 20, 30, 45, 60].map(dur => (
                    <button
                      key={dur}
                      onClick={() => setForm({ ...form, slot_duration: String(dur) })}
                      style={{
                        padding: "9px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                        border: form.slot_duration === String(dur) ? "2px solid #4f72ff" : "1.5px solid #e8ecf4",
                        background: form.slot_duration === String(dur) ? "#eef3ff" : "#fafbff",
                        color: form.slot_duration === String(dur) ? "#4f72ff" : "#7a84a0",
                        cursor: "pointer", transition: "all 0.15s ease",
                        fontFamily: "DM Sans, sans-serif"
                      }}
                    >
                      {dur} min
                    </button>
                  ))}
                </div>
              </div>

              <div className="info-badge" style={{ marginTop: 20 }}>
                📅 Patients can book slots within your defined hours automatically.
              </div>
            </div>
          )}

        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, gap: 12 }}>
          {currentStep > 1 ? (
            <button className="btn-secondary" onClick={() => setCurrentStep(s => s - 1)}>
              ← Back
            </button>
          ) : <div />}

          {currentStep < 3 ? (
            <button
              className="btn-primary"
              disabled={!canProceed()}
              onClick={() => setCurrentStep(s => s + 1)}
            >
              Continue →
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={submit}
              disabled={loading}
              style={{ minWidth: 160 }}
            >
              {loading ? "Saving..." : "🎉 Complete Setup"}
            </button>
          )}
        </div>

        {/* Progress dots */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {steps.map(s => (
              <div key={s.id} style={{
                width: currentStep === s.id ? 24 : 8, height: 8,
                borderRadius: 4, transition: "all 0.3s ease",
                background: currentStep >= s.id ? "#4f72ff" : "#dde1ef"
              }} />
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#a0aabf", marginTop: 8 }}>
            Step {currentStep} of {steps.length}
          </p>
        </div>

      </div>
    </div>
  )
}