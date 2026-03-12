import { useUser } from "@clerk/clerk-react"
import { useEffect, useState, useRef } from "react"
import Navbar from "../components/Navbar"

export default function DoctorProfile() {
  const { user } = useUser()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!user) return
    fetch(`http://127.0.0.1:5000/api/doctors/me/${user.id}`)
      .then(res => res.json())
      .then(data => setDoctor(data))
  }, [user])

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const updateProfile = async () => {

    if (!user || !doctor) return
  
    setLoading(true)
  
    const formData = new FormData()
  
    formData.append("clerk_user_id", user.id)
    formData.append("name", doctor.name || "")
    formData.append("specialization", doctor.specialization || "")
    formData.append("experience", doctor.years_of_experience || 0)
    formData.append("phone", doctor.phone || "")
    formData.append("address", doctor.address || "")
    formData.append("consultation_fee", doctor.consultation_fee || 0)
    formData.append("description", doctor.about || "")
  
    try {
  
      const res = await fetch(
        "http://127.0.0.1:5000/api/doctors/update-profile",
        {
          method: "POST",
          body: formData
        }
      )
  
      const data = await res.json()
  
      console.log(data)
  
      alert("Profile updated successfully")
  
    } catch (err) {
  
      console.error(err)
      alert("Update failed")
  
    }
  
    setLoading(false)
  }

  const set = (key) => (e) => setDoctor({ ...doctor, [key]: e.target.value })

  const specializations = [
    "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
    "Orthopedic", "Pediatrician", "Psychiatrist", "Gynecologist",
    "Ophthalmologist", "ENT Specialist", "Oncologist", "Radiologist", "Other"
  ]

  const currentImage = imagePreview || (doctor?.image ? `http://127.0.0.1:5000/static/${doctor.image}` : null)

  if (!doctor) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading your profile...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-3">
            🩺 Doctor Profile
          </span>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Your Profile</h1>
          <p className="text-gray-400 text-sm mt-1">Keep your information up to date for patients</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur border border-white rounded-2xl shadow-xl shadow-blue-50 p-8">

          {/* Avatar Section */}
          <div className="flex items-center gap-5 pb-6 mb-6 border-b border-gray-100">
            <div className="relative">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer overflow-hidden flex items-center justify-center bg-gray-50 transition-colors"
              >
                {currentImage
                  ? <img src={currentImage} alt="profile" className="w-full h-full object-cover" />
                  : <div className="text-center">
                      <div className="text-2xl">📷</div>
                      <div className="text-xs text-gray-400 mt-0.5">Photo</div>
                    </div>
                }
              </div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-600 transition-colors"
              >
                <span className="text-white text-xs">✏️</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-base">{doctor.name || "Your Name"}</p>
              <p className="text-sm text-gray-400">{doctor.specialization || "Specialization"}</p>
              <p className="text-xs text-blue-400 mt-1 cursor-pointer hover:text-blue-600" onClick={() => fileInputRef.current?.click()}>
                Change photo
              </p>
            </div>
          </div>

          {/* Section: Personal Info */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Personal Info</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                  value={doctor.name || ""}
                  onChange={set("name")}
                  placeholder="Dr. Rajesh Kumar"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Specialization</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all appearance-none cursor-pointer"
                  value={doctor.specialization || ""}
                  onChange={set("specialization")}
                >
                  <option value="">Select...</option>
                  {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                  value={doctor.years_of_experience || ""}
                  onChange={set("years_of_experience")}
                  placeholder="e.g. 8"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                  value={doctor.phone || ""}
                  onChange={set("phone")}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Section: Practice */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Practice</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Consultation Fee</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm pointer-events-none">₹</span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                    value={doctor.consultation_fee || ""}
                    onChange={set("consultation_fee")}
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Clinic Address</label>
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all"
                  value={doctor.address || ""}
                  onChange={set("address")}
                  placeholder="MG Road, Mumbai"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">About You</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all resize-none leading-relaxed"
                value={doctor.about || ""}
                onChange={set("about")}
                placeholder="Brief description about your expertise, approach to patient care, qualifications..."
              />
            </div>
          </div>

          {/* Info badge */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-500 mb-6">
            💡 Changes to your profile will be visible to patients immediately after saving.
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-500 font-medium animate-pulse">
                ✅ Profile updated successfully
              </span>
            )}
            {!saved && <div />}

            <button
              onClick={updateProfile}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all text-sm"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                : "💾 Save Changes"
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}