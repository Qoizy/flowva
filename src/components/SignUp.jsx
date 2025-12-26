import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff } from "lucide-react"; // Nice success icon

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // New success state

  const navigate = useNavigate();
  const referralCode = new URLSearchParams(window.location.search).get("ref");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: referralCode ? { referral_code: referralCode } : {},
        },
      });

      if (signupError) throw signupError;

      // 1. Trigger Success State
      setIsSuccess(true);

      // 2. Wait 2 seconds, then redirect
      setTimeout(() => {
        navigate("/dashboard"); // or wherever your dashboard route is
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred during signup");
      setLoading(false); // Only stop loading if there's an error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-500">
        {/* Success View */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="relative flex items-center justify-center mb-6">
              {/* The Animated Circular Timer */}
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-gray-100"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="251.2" /* 2 * PI * R (approx) */
                  className="text-green-500 animate-circle-timer"
                  strokeLinecap="round"
                />
              </svg>

              {/* Icon centered inside the circle */}
              <div className="absolute">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Account Created!
            </h1>
            <p className="text-gray-500 mt-2">
              Welcome aboard! Redirecting you in a moment...
            </p>
          </div>
        ) : (
          /* Normal Sign Up Form */
          <>
            <h1 className="text-2xl font-bold text-center mb-2">
              Create Your Account
            </h1>
            <p className="text-center text-gray-500 text-sm mb-6">
              Sign up to manage your tools
            </p>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 text-xs font-semibold uppercase tracking-wider"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 text-xs font-semibold uppercase tracking-wider"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? "Creating account…" : "Sign up Account"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-purple-600 font-medium"
              >
                Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
