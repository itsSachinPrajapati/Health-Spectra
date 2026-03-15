import { useUser } from "@clerk/clerk-react"
import { useEffect } from "react"

export default function RegisterDoctor() {
  const { user } = useUser()

  useEffect(() => {
    if (!user) return

    fetch(`${import.meta.env.VITE_API_URL}/api/doctors/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerk_user_id: user.id,
        email: user.primaryEmailAddress.emailAddress,
      }),
    })
  }, [user])

  return null
}