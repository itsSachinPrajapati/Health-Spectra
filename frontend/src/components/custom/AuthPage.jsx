import { SignIn, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthPage() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      try {
        // Ensure user exists in DB
        await axios.post("http://localhost:5000/api/users", {
          email: user.primaryEmailAddress.emailAddress,
          name: user.fullName,
          role: user.publicMetadata?.role || "patient",
        });

        // Fetch user role from DB
        const res = await axios.get(
          `http://localhost:5000/api/users/${user.primaryEmailAddress.emailAddress}`
        );

        if (res.data.role === "doctor") {
          navigate("/dashboard-doctor", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        console.error("User sync failed:", err);
      }
    };

    if (isSignedIn && user) {
      syncUser();
    }
  }, [isSignedIn, user, navigate]);

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left */}
      <div
        className="flex flex-col justify-center items-center p-10 text-white"
        style={{ background: "linear-gradient(135deg,#0ea5ea 0%,#7367f0 50%,#32d583 100%)" }}
      >
        <h1 className="text-4xl font-bold mb-4">Welcome Back 👋</h1>
        <p className="text-lg max-w-md text-center md:text-left">
          Sign in to access your AI healthcare dashboard.
        </p>
      </div>

      {/* Right */}
      <div className="flex justify-center items-center p-6 bg-white">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/"
          appearance={{ elements: { card: "shadow-xl border rounded-2xl p-6" } }}
        />
      </div>
    </div>
  );
}
