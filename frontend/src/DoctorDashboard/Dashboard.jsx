import React, { useEffect, useState } from "react";

const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    badge: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
  },
  upcoming: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
};

function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-pink-100 text-pink-700",
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
  ];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

function StatCard({ label, value, colorClass, delay }) {
  return (
    <div
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-1"
      style={{ animation: `fadeUp 0.4s ease both`, animationDelay: delay }}
    >
      <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function AppointmentCard({ apt, onConfirm, onReject, index }) {
  const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.upcoming;

  return (
    <div
      className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all duration-200 gap-4 flex-wrap"
      style={{ animation: `fadeUp 0.35s ease both`, animationDelay: `${index * 0.06}s` }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <Avatar name={apt.patient_name} />
        <div>
          <p className="text-sm font-semibold text-slate-800">{apt.patient_name}</p>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
            <span>📅 {apt.appointment_date}</span>
            <span className="text-slate-200">•</span>
            <span>
              {apt.time_slot ? `🕐 ${apt.time_slot}` : `🔢 Queue #${apt.queue_number}`}
            </span>
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>

        {apt.status === "upcoming" && (
          <>
            <button
              onClick={() => onConfirm(apt.id)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-sm"
            >
              Confirm
            </button>
            <button
              onClick={() => onReject(apt.id)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const doctorId = 11;

  const counts = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "upcoming").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    rejected: appointments.filter((a) => a.status === "rejected").length,
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/doctor/bookings?doctor_id=${doctorId}`)
      .then((r) => r.json())
      .then((data) => { setAppointments(data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  const handleConfirm = async (id) => {
    await fetch(`http://127.0.0.1:5000/api/doctor/booking/${id}/confirm`, { method: "PUT" });
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "confirmed" } : a));
  };

  const handleReject = async (id) => {
    await fetch(`http://127.0.0.1:5000/api/doctor/booking/${id}/reject`, { method: "PUT" });
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "rejected" } : a));
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="min-h-screen bg-slate-50">

        {/* Header */}
        <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-lg">
                🩺
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 leading-tight">MedPortal</p>
                <p className="text-xs text-slate-400 leading-tight">Doctor Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">Online</span>
            </div>

          </div>
        </header>

        {/* Main */}
        <main className="max-w-4xl mx-auto px-6 py-10">

          {/* Page heading */}
          <div className="mb-8" style={{ animation: "fadeUp 0.3s ease both" }}>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Appointments</h1>
            <p className="text-sm text-slate-400 mt-1">Manage and review your patient bookings</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total"     value={counts.total}     colorClass="text-indigo-600"  delay="0s"    />
            <StatCard label="Pending"   value={counts.pending}   colorClass="text-amber-500"   delay="0.07s" />
            <StatCard label="Confirmed" value={counts.confirmed} colorClass="text-emerald-600" delay="0.14s" />
            <StatCard label="Rejected"  value={counts.rejected}  colorClass="text-red-500"     delay="0.21s" />
          </div>

          {/* Appointments list */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">All Appointments</h2>
              {counts.pending > 0 && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  {counts.pending} pending
                </span>
              )}
            </div>

            <div className="p-4 space-y-3">
              {loading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">📋</p>
                  <p className="text-sm font-medium text-slate-500">No appointments found</p>
                  <p className="text-xs text-slate-400 mt-1">New bookings will appear here</p>
                </div>
              ) : (
                appointments.map((apt, i) => (
                  <AppointmentCard
                    key={apt.id}
                    apt={apt}
                    onConfirm={handleConfirm}
                    onReject={handleReject}
                    index={i}
                  />
                ))
              )}
            </div>

          </div>
        </main>
      </div>
    </>
  );
}