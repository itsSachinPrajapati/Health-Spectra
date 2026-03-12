import { Link, useLocation } from "react-router-dom"
import { UserButton } from "@clerk/clerk-react"

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: "/doctor/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/doctor/profile", label: "Profile", icon: "👤" },
  ]

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm shadow-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/doctor/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-shadow">
            <span className="text-white text-sm">🩺</span>
          </div>
          <span className="font-bold text-gray-800 tracking-tight text-lg">
            Health<span className="text-blue-500">Spectra</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon }) => {
            const active = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
                {active && <span className="w-1 h-1 rounded-full bg-blue-400 ml-0.5" />}
              </Link>
            )
          })}

          <div className="ml-3 pl-3 border-l border-gray-100">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

      </div>
    </div>
  )
}