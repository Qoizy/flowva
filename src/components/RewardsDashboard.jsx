import React, { useState, useEffect } from "react";
import {
  Calendar,
  Zap,
  Rocket,
  UserPlus,
  Gift,
  Trophy,
  Award,
  X,
  Upload,
  Send,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";
import gold from "../assets/gold.png";
import feat from "../assets/feat.png";
import { dbHelpers } from "../lib/supabase";

const RewardsDashboard = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [weekDays, setWeekDays] = useState([]);

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showCheckInSuccess, setShowCheckInSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const [claimEmail, setClaimEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    generateWeekDays();

    if (user?.id) {
      loadUserData();
    } else {
      console.log("No user ID available");
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const { data, error } = await dbHelpers.getUserDashboard(user.id);
      if (!error && data) {
        setUserData(data);
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateWeekDays = () => {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const today = new Date();
    const week = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayOfWeek = date.getDay();
      const dayLabel = days[dayOfWeek === 0 ? 6 : dayOfWeek - 1];

      week.push({
        label: dayLabel,
        date: date.toISOString().split("T")[0],
        isToday: i === 0,
      });
    }

    setWeekDays(week);
  };

  const handleCheckIn = async () => {
    if (!user?.id) {
      alert("Please sign in to claim points!");
      return;
    }

    setClaiming(true);
    try {
      const { data, error } = await dbHelpers.checkIn(user.id);

      if (!error && data?.success) {
        setEarnedPoints(data.points_earned || 5);

        await loadUserData();
        setShowCheckInSuccess(true);
      } else {
        alert(data?.message || "Check-in failed");
      }
    } catch (err) {
      console.error("Check-in error:", err);
      alert("Failed to check in. Please try again.");
    }
    setClaiming(false);
  };

  const isDayCheckedIn = (dateString) => {
    if (!userData?.check_in_week) return false;
    return userData.check_in_week.some((day) => day.date === dateString);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const totalPoints = userData?.rewards_data?.total_points ?? 5;
  const currentStreak = userData?.rewards_data?.current_streak ?? 1;
  const canCheckIn = userData?.can_check_in_today ?? true;
  const progressToGiftCard = Math.min((totalPoints / 5000) * 100, 100);

  const toggleModal = () => setShowClaimModal(!showClaimModal);

  return (
    <section>
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-7 w-1 bg-purple-600 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900">
          Your Rewards Journey
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Award className="text-purple-500" />
            </div>
            <span className="font-semibold text-gray-800">Points Balance</span>
          </div>

          <div className="p-6 flex flex-col">
            <div>
              <div className="flex justify-between items-center mb-16">
                <span className="text-5xl font-bold text-purple-600">
                  {totalPoints}
                </span>
                <div className="relative">
                  <div className="flex items-center justify-center">
                    <img
                      src={gold}
                      alt="Star-Gold"
                      className="w-[80px] h-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">
                  Progress to $5 Gift Card
                </span>
                <span className="font-semibold text-gray-900">
                  {totalPoints}/5000
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressToGiftCard}%` }}
                ></div>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <Rocket className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">
                  Just getting started — keep earning points!
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Calendar className="text-cyan-500" />
            </div>
            <span className="font-semibold text-gray-800">Daily Streak</span>
          </div>

          <div className="p-6 flex flex-col">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-8 text-start">
                {currentStreak} day{currentStreak !== 1 ? "s" : ""}
              </div>

              <div className="flex justify-center space-x-2 mb-12">
                {weekDays.map((day, i) => {
                  const isChecked = isDayCheckedIn(day.date);
                  const isToday = day.isToday;

                  return (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isChecked
                          ? "bg-cyan-500 text-white shadow-md"
                          : isToday
                          ? "bg-white text-purple-600 border-2 border-purple-600 ring-4 ring-purple-100"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {day.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm text-center text-gray-600 mb-4">
                Check in daily to earn +5 points
              </p>
              <button
                onClick={handleCheckIn}
                disabled={!canCheckIn || claiming}
                className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center space-x-2 ${
                  !canCheckIn
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-purple-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>
                  {claiming
                    ? "Claiming..."
                    : canCheckIn
                    ? "Claim Today's Points"
                    : "Already Claimed"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
          <div
            className="p-6 relative text-white"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
            }}
          >
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-5">
              Featured
            </span>
            <h3 className="font-bold text-xl mb-3">Top Tool Spotlight</h3>
            <p className="font-semibold text-lg opacity-95">Reclaim</p>

            <div className="absolute top-6 right-6 flex items-center justify-center">
              <img src={feat} alt="Feat" className="w-[90px] h-full" />
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base mb-2">
                    Automate and Optimize Your Schedule
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Reclaim.ai is an AI-powered calendar assistant that
                    automatically schedules your tasks, meetings, and breaks to
                    boost productivity. Free to try — earn Flowva Points when
                    you sign up!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-[50px] mt-4">
              <button className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:shadow-lg text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <UserPlus className="w-4 h-4" />
                <span>Sign up</span>
              </button>
              <button
                onClick={toggleModal}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Gift className="w-4 h-4" />
                <span>Claim 50 pts</span>
              </button>
            </div>
          </div>
        </div>

        {showClaimModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Claim Your 50 Points
                </h3>
                <button
                  onClick={toggleModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Sign up for Reclaim (free, no payment needed), then fill the
                  form below:
                  <br />
                  1️⃣ Enter your Reclaim sign-up email.
                  <br />
                  2️⃣ Upload a screenshot of your Reclaim profile showing your
                  email.
                  <br />
                  <span className="text-purple-600 font-medium italic mt-2 block">
                    After verification, you'll get 50 Flowva Points! 🎉😊
                  </span>
                </p>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Email used on Reclaim
                  </label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={claimEmail}
                    onChange={(e) => setClaimEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Upload screenshot (mandatory)
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                    <div className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center space-x-2 bg-gray-50 group-hover:bg-purple-50 group-hover:border-purple-200 transition-all">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500 font-medium">
                        {selectedFile ? selectedFile.name : "Choose file"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end space-x-3">
                <button
                  onClick={toggleModal}
                  className="px-6 py-2.5 font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2.5 font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-lg active:scale-95 transition-all"
                  onClick={() => {
                    alert("Claim submitted! Our team will verify it shortly.");
                    toggleModal();
                  }}
                >
                  Submit Claim
                </button>
              </div>
            </div>
          </div>
        )}

        {showCheckInSuccess && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PartyPopper className="w-10 h-10 text-green-600" />
                </div>

                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                  Awesome! 🎉
                </h3>
                <p className="text-gray-600 mb-6">
                  You've successfully claimed your daily points. Keep the streak
                  alive!
                </p>

                <div className="bg-purple-50 rounded-2xl p-4 mb-8">
                  <span className="text-sm text-purple-600 font-bold block uppercase tracking-wider mb-1">
                    Points Earned
                  </span>
                  <span className="text-4xl font-black text-purple-700">
                    +{earnedPoints} pts
                  </span>
                </div>

                <button
                  onClick={() => setShowCheckInSuccess(false)}
                  className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  Great, thanks!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RewardsDashboard;
