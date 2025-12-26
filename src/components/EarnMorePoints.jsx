import React from "react";
import { Star, Share2, X, Layers } from "lucide-react";
import { useState } from "react";

const EarnMorePoints = ({ user }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const toggleShareModal = () => setIsShareModalOpen(!isShareModalOpen);

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <span className="h-6 w-1 rounded-full bg-purple-600" />
        <h2 className="text-2xl font-bold text-slate-900">Earn More Points</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        <div className="rounded-2xl border border-gray-200 hover:border-purple-500 bg-white overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
          <div className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Refer and win 10,000 points!
            </h3>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="p-6 bg-gradient-to-br from-purple-50 to-white text-sm text-gray-700 leading-relaxed">
            Invite 3 friends by Nov 20 and earn a chance to be one of 5 winners
            of{" "}
            <span className="font-semibold text-purple-600">10,000 points</span>
            . Friends must complete onboarding to qualify.
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 hover:border-purple-500 bg-white overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
          <div className="flex items-center gap-4 px-6 py-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
              <Share2 className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900">
                Share Your Stack
              </h3>
              <p className="text-sm text-gray-600">Earn +25 pts</p>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between px-6 py-5">
            <p className="text-sm text-gray-700">Share your tool stack</p>

            <button
              onClick={toggleShareModal}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-2.5 text-sm font-semibold text-white hover:shadow-lg transition-all hover:scale-105"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        {isShareModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
              <div className="flex justify-end p-4">
                <button
                  onClick={toggleShareModal}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="px-8 pb-12 flex flex-col items-center text-center">
                <h3 className="text-3xl font-extrabold text-gray-900 mb-8">
                  Share Your Stack
                </h3>

                <div className="flex items-center justify-center mb-10">
                  <div className="flex items-center justify-center">
                    <Layers className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-[280px]">
                  You have no stack created yet, go to{" "}
                  <span className="text-purple-600 font-bold cursor-pointer hover:underline">
                    Tech Stack
                  </span>{" "}
                  to create one.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EarnMorePoints;
