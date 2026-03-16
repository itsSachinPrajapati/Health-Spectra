import { SignUp, useUser } from "@clerk/clerk-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function RegisterPage() {

  const { isSignedIn, user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {

    const syncUser = async () => {

      if (!user) return

      try {

        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/save-user`, {
          email: user.primaryEmailAddress.emailAddress,
          name: user.fullName,
          role: "patient"
        })

        navigate("/dashboard", { replace: true })

      } catch (err) {
        console.error("User sync failed:", err)
      }

    }

    if (isSignedIn && user) {
      syncUser()
    }

  }, [isSignedIn, user, navigate])


  return (

    <div className="min-h-screen w-full grid md:grid-cols-2">

      <div
        className="flex flex-col justify-center items-center text-white p-10"
        style={{
          background:
            "linear-gradient(135deg,#22c55e 0%,#06b6d4 50%,#7c3aed 100%)",
        }}
      >

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Join Us 🚀
        </h1>

        <p className="text-lg max-w-md text-center md:text-left">
          Create your free account and start exploring AI-powered health assistance today.
        </p>

      </div>

      <div className="flex justify-center items-center p-6 bg-white">

        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/"
          appearance={{
            elements: { card: "shadow-xl border rounded-2xl p-6" }
          }}
        />

      </div>

    </div>

  )
}