// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

// Components
import Header from "./components/custom/header.jsx";
import Hero from "./components/custom/hero.jsx";
import MRICard from "./components/custom/MRIcard.jsx";

import SignInPage from "./components/custom/AuthPage.jsx";
import SignUpPage from "./components/custom/RegisterPage.jsx";
import Dashboard from "./PatientDashboard/Dashboard.jsx";
import ProtectedRoute from "./components/custom/ProtectedRoute.jsx";
import DiseaseDetection from "./components/custom/DiseaseDetection.jsx";
import VoiceBot from "./components/custom/VoiceBot.jsx";
import ReportAnalyzer from "./Reports/ReportAnalyzer.jsx";

// Pages
import Tools from "./pages/Tools.jsx";
import UserHistory from "./pages/UserHistory.jsx";
import Pricing from "./pages/Pricing.jsx";
import Profile from "./pages/Profile.jsx";
import MedicalVoiceAgent from "./medical_agent/MedicalVoiceAgent";

// Doctor Dashboard
import DoctorDashboard from "./DoctorDashboard/Dashboard.jsx"
import BookingDashboard from "./AppointmentBooking/BookingDashboard.jsx";
import CategoryPage from "./AppointmentBooking/CategoryPage.jsx";
import DoctorDetails from "./AppointmentBooking/DoctorDetails.jsx";
import MyBookings from "./AppointmentBooking/MyBookings.jsx";
import DoctorProfile from "./Doctor/DoctorProfile.jsx";

// Home page component
function HomePage() {
  return (
    <>
      <Hero />
    </>
  );
}

export default function App() {
  const { isSignedIn } = useUser(); 

  return (
    <Routes>
      {/* Home */}
      <Route
        path="/"
        element={isSignedIn ? <Navigate to="/dashboard" /> : <HomePage />}
      />

      {/* Auth */}
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-appointment"
        element={
          <ProtectedRoute>
            <BookingDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-appointment/category"
        element={
          <ProtectedRoute>
            <CategoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-appointment/doctor/:id"
        element={
          <ProtectedRoute>
            <DoctorDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-appointment/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard-doctor"
        element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      


      {/* Dashboard subpages */}
      <Route
        path="/dashboard/history"
        element={
          <ProtectedRoute>
            <UserHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/pricing"
        element={
          <ProtectedRoute>
            <Pricing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tools"
        element={
          <ProtectedRoute>
            <Tools />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/tools/disease-detection"
        element={
          <ProtectedRoute>
            <DiseaseDetection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tools/voicebot"
        element={
          <ProtectedRoute>
            <VoiceBot />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tools/report-analyzer"
        element={
          <ProtectedRoute>
            <ReportAnalyzer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tools/mri"
        element={
          <ProtectedRoute>
            <MRICard />
          </ProtectedRoute>
        }
      />

      {/* Medical agent */}
      <Route
        path="/medical-agent/:sessionId"
        element={
          <ProtectedRoute>
            <MedicalVoiceAgent />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/doctor-profile"
        element={
          <ProtectedRoute>
            <DoctorProfile />
          </ProtectedRoute>
        }
      />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
