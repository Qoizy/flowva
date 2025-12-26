import { useState } from "react";
import RewardsDashboard from "../components/RewardsDashboard";
import EarnMorePoints from "../components/EarnMorePoints";
import ReferAndEarn from "../components/ReferAndEarn";
import RedeemRewards from "../components/RedeemRewards";

const RewardsHub = ({ user }) => {
  const [activeTab, setActiveTab] = useState("earn");

  const TabButton = ({ label, active, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`
          px-4 py-3 text-[16px] font-bold transition-all relative
          ${
            active
              ? "text-purple-600 bg-purple-50 rounded-t-lg"
              : "text-gray-500 hover:bg-purple-100 rounded-t-lg"
          }
        `}
      >
        {label}
        {active && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 shadow-[0_-1px_4px_rgba(147,51,234,0.3)]" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center space-x-4 border-b border-gray-100">
        <TabButton
          label="Earn Points"
          active={activeTab === "earn"}
          onClick={() => setActiveTab("earn")}
        />
        <TabButton
          label="Redeem Rewards"
          active={activeTab === "redeem"}
          onClick={() => setActiveTab("redeem")}
        />
      </div>

      <div className="animate-in fade-in duration-500">
        {activeTab === "earn" && (
          <>
            <RewardsDashboard user={user} />
            <div className="mt-10 space-y-10">
              <EarnMorePoints user={user} />
              <ReferAndEarn user={user} />
            </div>
          </>
        )}

        {activeTab === "redeem" && <RedeemRewards user={user} />}
      </div>
    </div>
  );
};

export default RewardsHub;
