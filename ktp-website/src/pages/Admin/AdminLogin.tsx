import { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Hardcode allowed emails, or fetch this from a DB collection 'admins'
const ALLOWED_EMAILS = ["president@ktp-bostonu.com", "tech-chair@ktp-bostonu.com"];

export default function AdminLogin() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (email && ALLOWED_EMAILS.includes(email)) {
        // Success: Redirect to the dashboard
        navigate("/dashboard");
      } else {
        // Fail: Sign them out immediately
        await auth.signOut();
        setError("Access Denied: You are not an authorized admin.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">KTP Admin Portal</h1>
      <button 
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
      >
        Sign in with Google
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}