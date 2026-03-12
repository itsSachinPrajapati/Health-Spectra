import { SignIn, SignedOut, useUser } from "@clerk/clerk-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function DoctorLogin() {

  const { isSignedIn, user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {

    const verifyDoctor = async () => {

      if (!user) return
    
      try {
    
        const res = await axios.get(
          `http://127.0.0.1:5000/api/doctors/me/${user.id}`
        )
    
        const doctor = res.data
    
        if (!doctor.name) {
          navigate("/doctor/onboarding", { replace: true })
        } else {
          navigate("/doctor/dashboard", { replace: true })
        }
    
      } catch (err) {
    
        navigate("/doctor/onboarding")
    
      }
    
    }
    if (isSignedIn && user) {
      verifyDoctor()
    }

  }, [isSignedIn, user, navigate])

  return (

    <div className="flex justify-center items-center h-screen">

      <SignedOut>
        <SignIn
          routing="path"
          path="/doctor/login"
          signUpUrl="/doctor/signup"
        />
      </SignedOut>

    </div>

  )
}