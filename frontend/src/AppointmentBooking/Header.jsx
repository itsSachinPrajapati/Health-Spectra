import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-5 py-3">
        
        {/* Logo / Brand */}
        <Link to="/" className="text-lg font-bold text-gray-800 hover:text-blue-600">
          🩺 HealthSpectra
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link to="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/book-appointment/my-bookings" className="hover:text-blue-600">
            My Bookings
          </Link>
        </nav>

        {/* User Button */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}
