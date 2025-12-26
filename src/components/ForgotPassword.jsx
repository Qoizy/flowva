import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/update-password`,
      }
    );

    if (resetError) {
      if (resetError.status === 429) {
        setError("Too many requests. Please wait a while before trying again.");
      } else {
        setError(resetError.message);
      }
      setLoading(false);
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#7C3AED] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 transition-all duration-500">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="relative flex items-center justify-center mb-6">
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
                  strokeDasharray="251.2"
                  className="text-green-500 animate-circle-timer"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Check your email
            </h1>
            <p className="text-gray-500 mt-2 leading-relaxed">
              We've sent a password reset link to <br />
              <span className="font-semibold text-gray-900">{email}</span>
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-8 text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign in
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#7C3AED] mb-2">
                Reset Password
              </h1>
              <p className="text-gray-500 text-sm mb-8">
                Enter your email to receive a reset link
              </p>
            </div>

            <form onSubmit={handleResetRequest} className="space-y-6">
              <div className="text-left">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#9333EA] hover:bg-[#7E22CE] text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-500 text-sm hover:text-purple-600 transition-colors"
              >
                Remember your password?{" "}
                <span className="text-[#7C3AED] font-bold">Sign in</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
