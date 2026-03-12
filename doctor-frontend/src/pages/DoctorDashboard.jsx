import { useUser } from "@clerk/clerk-react"
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"

export default function DoctorDashboard() {
  const { user } = useUser()

  const [data, setData] = useState({
    queue_today: 0,
    slots_today: 0,
    total_appointments: 0,
    queue_list: []
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch(`http://127.0.0.1:5000/api/doctors/dashboard/${user.id}`)
      .then(res => res.json())
      .then(res => {
        setData(res)
        setLoading(false)
      })
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: "Total Appointments",
      value: data.total_appointments,
      icon: "📋",
      color: "from-blue-500 to-indigo-500",
      bg: "from-blue-50 to-indigo-50",
      border: "border-blue-100",
      text: "text-blue-600",
    },
    {
      label: "Queue Today",
      value: data.queue_today,
      icon: "🧍",
      color: "from-violet-500 to-purple-500",
      bg: "from-violet-50 to-purple-50",
      border: "border-violet-100",
      text: "text-violet-600",
    },
    {
      label: "Slots Booked Today",
      value: data.slots_today,
      icon: "🗓️",
      color: "from-emerald-500 to-teal-500",
      bg: "from-emerald-50 to-teal-50",
      border: "border-emerald-100",
      text: "text-emerald-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-3">
            🩺 Doctor Dashboard
          </span>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"},{" "}
            Dr. {user?.firstName || "Doctor"} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Here's what's happening at your clinic today
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-6 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-xs font-bold ${stat.text} uppercase tracking-wider`}>
                  Today
                </span>
              </div>
              <p className={`text-4xl font-bold ${stat.text} mb-1`}>
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Queue Table */}
        <div className="bg-white/80 backdrop-blur border border-white rounded-2xl shadow-xl shadow-blue-50 overflow-hidden">

          {/* Table Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Today's Queue</h3>
              <p className="text-xs text-gray-400 mt-0.5">{data.queue_list.length} patient{data.queue_list.length !== 1 ? "s" : ""} waiting</p>
            </div>
            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-500 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Live
            </span>
          </div>

          {data.queue_list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-300">
              <span className="text-5xl">🏥</span>
              <p className="text-sm font-medium text-gray-400">No patients in queue today</p>
              <p className="text-xs text-gray-300">Patients will appear here when they join</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider w-20">#</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider w-28">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.queue_list.map((p, i) => (
                  <tr key={i} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                        {p.queue_number}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">
                          {p.patient_name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{p.patient_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{p.issue || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        i === 0
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-500"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-emerald-400" : "bg-amber-400"}`} />
                        {i === 0 ? "Current" : "Waiting"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}