import { useState } from "react";
import { Landmark, Star } from "lucide-react";
import money from "../assets/money.png";
import book from "../assets/book.png";
import gift from "../assets/gift.png";

const RedeemRewards = () => {
  const [activeTab, setActiveTab] = useState("all");

  const rewards = [
    {
      id: 1,
      title: "$5 Bank Transfer",
      description:
        "The $5 equivalent will be transferred to your bank account.",
      cost: 5000,
      type: "money",
      status: "locked",
    },
    {
      id: 2,
      title: "$5 PayPal International",
      description:
        "Receive a $5 PayPal balance transfer directly to your PayPal account email.",
      cost: 5000,
      type: "money",
      status: "locked",
    },
    {
      id: 3,
      title: "$5 Virtual Visa Card",
      description:
        "Use your $5 prepaid card to shop anywhere Visa is accepted online.",
      cost: 5000,
      type: "gift",
      status: "locked",
    },
    {
      id: 4,
      title: "$5 Apple Gift Card",
      description:
        "Redeem this $5 Apple Gift Card for apps, games, music, movies, and more on the App Store and iTunes.",
      cost: 5000,
      type: "gift",
      status: "locked",
    },
    {
      id: 5,
      title: "$5 Google Play Card",
      description:
        "Use this $5 Google Play Gift Card to purchase apps, games, movies, books, and more on the Google Play Store.",
      cost: 5000,
      type: "gift",
      status: "locked",
    },
    {
      id: 6,
      title: "$5 Amazon Gift Card",
      description:
        "Get a $5 digital card to spend on your favorite tools or platforms.",
      cost: 5000,
      type: "gift",
      status: "locked",
    },
    {
      id: 7,
      title: "$10 Amazon Gift Card",
      description:
        "Get a $10 digital card to spend on your favorite tools or platforms.",
      cost: 10000,
      type: "gift",
      status: "locked",
    },
    {
      id: 8,
      title: "Free Udemy Course",
      description: "Coming Soon!",
      cost: null,
      type: "book",
      status: "coming_soon",
    },
  ];

  const getImage = (type) => {
    switch (type) {
      case "money":
        return money;
      case "gift":
        return gift;
      case "book":
        return book;
      default:
        return <Landmark className="text-purple-300 w-7 h-7" />;
    }
  };

  const counts = {
    all: rewards.length,
    unlocked: rewards.filter((r) => r.status === "unlocked").length,
    locked: rewards.filter((r) => r.status === "locked").length,
    coming: rewards.filter((r) => r.status === "coming_soon").length,
  };

  const filteredRewards = rewards.filter((reward) => {
    if (activeTab === "all") return true;
    if (activeTab === "coming") return reward.status === "coming_soon";
    return reward.status === activeTab;
  });

  const TabButton = ({ label, count, id }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-3 text-[16px] font-semibold transition-all flex items-center gap-2 relative flex-shrink-0
        ${
          activeTab === id
            ? "text-purple-600 bg-purple-50 rounded-t-lg"
            : "text-gray-500 hover:text-gray-700"
        }
      `}
    >
      {label}
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[12px] 
        ${
          activeTab === id
            ? "bg-purple-100 text-purple-600"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {count}
      </span>
      {activeTab === id && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600" />
      )}
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="w-1 h-7 bg-purple-600 rounded-full" />
        <h2 className="text-[24px] font-bold text-gray-900">
          Redeem Your Points
        </h2>
      </div>

      <div className="relative border-b border-gray-100">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth pb-px">
          <TabButton label="All Rewards" count={counts.all} id="all" />
          <TabButton label="Unlocked" count={counts.unlocked} id="unlocked" />
          <TabButton label="Locked" count={counts.locked} id="locked" />
          <TabButton label="Coming Soon" count={counts.coming} id="coming" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.length > 0 ? (
          filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <img
                  src={getImage(reward.type)}
                  alt={reward.type}
                  className="w-[56px] h-full object-contain"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {reward.title}
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed px-2">
                {reward.description}
              </p>

              <div className="flex items-center gap-1 mb-8 text-purple-600 font-bold">
                <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                <span className="text-sm">
                  {reward.cost ? `${reward.cost} pts` : 0}
                </span>
              </div>

              <button
                disabled
                className="w-full py-3 bg-[#E9EBF1] text-[#B0B7C3] font-bold rounded-xl text-sm"
              >
                {reward.status === "coming_soon" ? "Coming Soon" : "Locked"}
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400 italic">
            No rewards found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default RedeemRewards;
