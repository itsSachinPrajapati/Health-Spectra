import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-slate-50 via-blue-50 to-cyan-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-5 py-3">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-700">
          🩺HealthSpectra
        </Link>

        {/* Desktop Navbar */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <Link to="/">Home</Link>

          {/* Services Dropdown */}
          <div className="relative group">
            <button className="hover:text-blue-600 flex items-center gap-1">
              Services
            </button>
            <ul className="absolute hidden group-hover:block z-50 mt-2 bg-white/90 backdrop-blur-md shadow-md rounded-lg w-48 py-2">
              <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded">Symptom Checker</li>
              <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded">Report Analyzer</li>
              <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded">AI Chatbot</li>
              <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded">Disease Detection</li>
            </ul>
          </div>

          {/* Tools Dropdown */}
          <div className="relative group">
            <button className="hover:text-blue-600 flex items-center gap-1">
              Tools
            </button>
            <ul className="absolute hidden group-hover:block z-50 mt-2 bg-white/90 backdrop-blur-md shadow-md rounded-lg w-48 py-2">
              <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded">Machine Learning Model</li>
              <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded">NLP Analyzer</li>
              <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded">Data Parser</li>
            </ul>
          </div>

          <Link to="/about">About</Link>

          {/* Auth Links */}
          <SignedOut>
            <div className="flex items-center gap-3">
              <Link
                to="/sign-in"
                className="px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg border hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-md rounded-b-lg p-4 space-y-3 text-gray-700 font-medium">
          <Link to="/" className="block">Home</Link>
          <Link to="/symptom" className="block">Symptom Checker</Link>
          <Link to="/report" className="block">Report Analyzer</Link>
          <Link to="/chat" className="block">AI Chatbot</Link>
          <Link to="/disease" className="block">Disease Detection</Link>
          <Link to="/about" className="block">About</Link>

          <SignedOut>
            <div className="flex flex-col gap-2">
              <Link
                to="/sign-in"
                className="px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-center"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
              >
                Sign Up
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      )}
    </header>
  );
}
