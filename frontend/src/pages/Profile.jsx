import { useUser } from "@clerk/clerk-react";
import { Mail, Shield, User, Camera, Bell, ChevronRight, Activity, FileText, Calendar, Clock } from "lucide-react";
import Header from "../PatientDashboard/DashboardHeader";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
        <span className="text-slate-400 text-sm font-medium">Loading your profile…</span>
      </div>
    </div>
  );

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U";
  const role = user.publicMetadata?.role ?? "Patient";

  const quickLinks = [
    { icon: <FileText size={15} />, label: "My Reports" },
    { icon: <Calendar size={15} />, label: "Appointments" },
    { icon: <Activity size={15} />, label: "Health Activity" },
    { icon: <Bell size={15} />, label: "Notifications" },
  ];

  return (
    <div className="min-h-screen bg-[#F0F6FF] font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap'); .font-display { font-family: 'Lora', serif; } .font-body { font-family: 'DM Sans', sans-serif; }`}</style>

      <Header />

      <main className="max-w-6xl mx-auto px-8 py-12">

        {/* Page title */}
        <div className="mb-10">
          <p className="text-[10px] font-bold tracking-widest uppercase text-blue-300 mb-1">Account</p>
          <h1 className="font-display text-4xl font-semibold text-slate-900 tracking-tight">My Profile</h1>
        </div>

        <div className="grid gap-6 items-start" style={{ gridTemplateColumns: "300px 1fr" }}>

          {/* ── LEFT ── */}
          <div className="flex flex-col gap-5">

            {/* Avatar card */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-[0_4px_24px_rgba(37,99,235,0.06)] p-8 text-center">
              <div className="relative inline-block mb-5">
                <div className="absolute inset-[-6px] rounded-full border-2 border-dashed border-blue-200 animate-spin" style={{ animationDuration: "12s" }} />
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-[3px] border-white shadow-lg" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-200">
                    <span className="text-2xl font-bold text-white">{initials}</span>
                  </div>
                )}
              </div>

              <h2 className="font-display text-xl font-semibold text-slate-900 mb-1">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-slate-400 mb-4">{user.primaryEmailAddress?.emailAddress}</p>

              <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                <Shield size={10} /> {role}
              </span>

              <button className="mt-5 w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-xl py-2.5 text-sm font-semibold text-blue-500 flex items-center justify-center gap-2 transition-all duration-200">
                <Camera size={14} /> Change Photo
              </button>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-[0_4px_24px_rgba(37,99,235,0.06)] p-5">
              <p className="text-[10px] font-bold tracking-widest uppercase text-blue-300 mb-3">Quick Access</p>
              <div className="flex flex-col gap-2">
                {quickLinks.map((link, i) => (
                  <a key={i} href="#" className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-[#F8FAFF] border border-blue-50 hover:bg-blue-50 hover:border-blue-200 hover:translate-x-1 transition-all duration-200 no-underline">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <span className="text-blue-400">{link.icon}</span>
                      <span className="text-[13px] font-medium">{link.label}</span>
                    </div>
                    <ChevronRight size={13} className="text-slate-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Member since */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-400 rounded-2xl p-5 shadow-lg shadow-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={13} className="text-blue-200" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-blue-200">Member Since</span>
              </div>
              <p className="font-display text-xl font-semibold text-white">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                  : "Early Access"}
              </p>
              <p className="text-xs text-blue-200 mt-1">Early Access Member</p>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex flex-col gap-6">

            {/* Personal info */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-[0_4px_24px_rgba(37,99,235,0.06)] p-8">
              <div className="flex items-center justify-between mb-7">
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-blue-300 mb-1">Personal Information</p>
                  <h3 className="font-display text-xl font-semibold text-slate-900">Account Details</h3>
                </div>
                <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg px-4 py-2 text-xs font-semibold text-blue-500 transition-all duration-200">
                  Edit Profile
                </button>
              </div>

              <div>
                {[
                  { label: "First Name", value: user.firstName || "—", icon: <User size={13} /> },
                  { label: "Last Name", value: user.lastName || "—", icon: <User size={13} /> },
                  { label: "Email Address", value: user.primaryEmailAddress?.emailAddress || "—", icon: <Mail size={13} /> },
                  { label: "Role", value: role, icon: <Shield size={13} /> },
                ].map((field, i, arr) => (
                  <div key={i} className={`flex flex-col gap-1 py-4 ${i < arr.length - 1 ? "border-b border-[#F1F5FF]" : ""}`}>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      {field.icon}
                      <span className="text-[10px] font-bold tracking-widest uppercase">{field.label}</span>
                    </div>
                    <p className="text-[15px] font-medium text-slate-800 mt-0.5">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-[0_4px_24px_rgba(37,99,235,0.06)] p-8">
              <p className="text-[10px] font-bold tracking-widest uppercase text-blue-300 mb-1">Security</p>
              <h3 className="font-display text-xl font-semibold text-slate-900 mb-6">Account Security</h3>

              <div className="flex flex-col gap-3">
                {[
                  { label: "Password", sub: "Last updated recently", status: "Secure", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                  { label: "Two-Factor Authentication", sub: "Adds an extra layer of protection", status: "Optional", color: "text-amber-600 bg-amber-50 border-amber-200" },
                  { label: "Active Sessions", sub: "Manage where you're signed in", status: "View", color: "text-blue-600 bg-blue-50 border-blue-200" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3.5 bg-[#F8FAFF] rounded-xl border border-blue-50">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-700 mb-0.5">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.sub}</p>
                    </div>
                    <span className={`text-[10px] font-bold tracking-wide border px-3 py-1 rounded-full ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy notice */}
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex gap-3 items-start">
              <Shield size={13} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-blue-500">Privacy Notice: </strong>
                Your profile data is encrypted and never shared with third parties. You can request full deletion of your data at any time from account settings.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}