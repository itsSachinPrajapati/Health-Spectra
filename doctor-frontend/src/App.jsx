import { Routes, Route, Navigate } from "react-router-dom"
import DoctorLogin from "./pages/DoctorLogin"
import DoctorSignUp from "./pages/DoctorSignUp"
import DoctorDashboard from "./pages/DoctorDashboard"
import DoctorOnboarding from "./pages/DoctorOnboarding"
import DoctorProfile from "./pages/DoctorProfile"

export default function App(){

  return(

    <Routes>

      <Route path="/" element={<Navigate to="/doctor/login"/>} />

      <Route path="/doctor/login/*" element={<DoctorLogin/>} />

      <Route path="/doctor/signup/*" element={<DoctorSignUp />} />
      
      <Route path="/doctor/dashboard" element={<DoctorDashboard/>} />

      <Route path="/doctor/onboarding" element={<DoctorOnboarding/>} />

      <Route path="/doctor/profile" element={<DoctorProfile/>} />

    </Routes>

  )

}