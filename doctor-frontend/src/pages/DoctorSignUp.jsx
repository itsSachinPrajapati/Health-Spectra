import { SignUp } from "@clerk/clerk-react"

export default function DoctorSignup() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp
        routing="path"
        path="/doctor/signup"
        signInUrl="/doctor/login"
      />
    </div>
  )
}