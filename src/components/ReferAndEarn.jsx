import React, { useState, useEffect } from "react";
import { dbHelpers, utils } from "../lib/supabase";
import {
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Copy,
  Users,
  CheckCircle,
} from "lucide-react";

const ReferAndEarn = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const [referralCode, setReferralCode] = useState("");
  const [referralsCount, setReferralsCount] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);

  useEffect(() => {
    if (!user?.id) {
      setError("Please log in to view referrals");
      setLoading(false);
      return;
    }

    loadReferralData();
  }, [user]);

  const loadReferralData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: rewardsData, error: rewardsError } =
        await dbHelpers.getUserRewards(user.id);

      if (rewardsError) throw rewardsError;

      const { data: referrals, error: referralsError } =
        await dbHelpers.getUserReferrals(user.id);

      if (referralsError) throw referralsError;

      setReferralCode(rewardsData?.referral_code || "");
      setReferralsCount(referrals?.length || 0);
      setPointsEarned((referrals?.length || 0) * 25);
    } catch (err) {
      console.error("Referral load error:", err);
      setError(err?.message || "Failed to load referral data");
    } finally {
      setLoading(false);
    }
  };

  const referralLink = referralCode
    ? utils.generateReferralLink(referralCode)
    : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy link");
    }
  };

  const shareOnSocial = (platform) => {
    const text = `Join me on Flowva and earn rewards! Use my referral link: ${referralLink}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(referralLink);

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
    };

    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
        <div className="h-24 bg-gray-100 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 text-red-600 p-6 border border-red-200">
        <p className="font-semibold mb-2">Error loading referrals</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      <div className="flex items-center gap-3 mb-6">
        <span className="h-6 w-1 rounded-full bg-purple-600" />
        <h2 className="text-2xl font-bold text-slate-900">Refer & Earn</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <Users className="text-purple-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Share Your Link</h3>
            <p className="text-gray-600 text-sm">
              Invite friends and earn 25 points when they join!
            </p>
          </div>
        </div>

        <div className="flex justify-around py-10 bg-white">
          <div className="text-center">
            <p className="text-5xl font-bold text-purple-600">
              {referralsCount}
            </p>
            <p className="text-gray-700 font-medium mt-2">Referrals</p>
          </div>

          <div className="w-px bg-gray-200"></div>

          <div className="text-center">
            <p className="text-5xl font-bold text-purple-600">{pointsEarned}</p>
            <p className="text-gray-700 font-medium mt-2">Points Earned</p>
          </div>
        </div>

        <div className="bg-purple-50 px-6 py-8 mx-6 rounded-2xl">
          <label className="block mb-3 font-semibold text-gray-900">
            Your personal referral link:
          </label>

          <div className="flex items-center bg-white border-2 border-purple-200 rounded-xl overflow-hidden shadow-sm">
            <input
              readOnly
              value={referralLink}
              className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
            />
            <button
              onClick={copyLink}
              className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
                copied ? "bg-green-500 text-white" : "text-purple-500"
              }`}
              aria-label="Copy referral link"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-1 py-6 bg-white">
          <button
            onClick={() => shareOnSocial("facebook")}
            className="p-3 rounded-full hover:bg-blue-50 transition-colors"
            aria-label="Share on Facebook"
          >
            <Facebook className="w-6 h-6 text-blue-600" />
          </button>
          <button
            onClick={() => shareOnSocial("twitter")}
            className="p-3 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Share on Twitter"
          >
            <Twitter className="w-6 h-6 text-black" />
          </button>
          <button
            onClick={() => shareOnSocial("linkedin")}
            className="p-3 rounded-full hover:bg-blue-50 transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-6 h-6 text-blue-700" />
          </button>
          <button
            onClick={() => shareOnSocial("whatsapp")}
            className="p-3 rounded-full hover:bg-green-50 transition-colors"
            aria-label="Share on WhatsApp"
          >
            <MessageCircle className="w-6 h-6 text-green-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarn;
