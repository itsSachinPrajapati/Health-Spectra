import React, { useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function DashboardHeader() {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="flex justify-between items-center px-5 py-3 shadow-md bg-white sticky top-0 z-10">
        {/* Logo */}
        <h1 className="text-xl font-bold text-blue-600">🩺HealthSpectra</h1>

        {/* Desktop Navbar */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/book-appointment" className="hover:text-blue-600">Book Appointment</Link>
          <Link to="/dashboard/tools" className="hover:text-blue-600">Tools</Link>
          <Link to="/dashboard/history" className="hover:text-blue-600">History</Link>
          <Link to="/dashboard/pricing" className="hover:text-blue-600">Pricing</Link>
          <Link to="/dashboard/profile" className="hover:text-blue-600">Profile</Link>
        </nav>

        {/* User section (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <p className="hidden sm:block text-gray-700 text-sm font-medium">
            Hello, {user?.firstName || "User"} 👋
          </p>
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-5 py-4 flex flex-col gap-4">
          <Link to="/" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/tools" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Tools</Link>
          <Link to="/history" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>History</Link>
          <Link to="/pricing" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link to="/profile" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Profile</Link>

          {/* User Section (mobile) */}
          <div className="flex items-center gap-3 pt-2 border-t">
            <p className="text-gray-700 text-sm font-medium">
              Hello, {user?.firstName || "User"} 👋
            </p>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      )}
    </div>
  );
}
