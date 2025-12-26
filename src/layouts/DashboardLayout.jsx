import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RewardsHub from "../Pages/RewardHubs";
import { useAuth } from "../context/AuthContexts";

const DashboardLayout = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [activeRoute, setActiveRoute] = useState("rewards");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar
        activeRoute={activeRoute}
        user={user}
        onNavigate={(route) => {
          setActiveRoute(route);
          setIsMobileMenuOpen(false);
        }}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 relative z-0">
        <Header
          title="Rewards Hub"
          subtitle="Earn points, unlock rewards, and celebrate your progress!"
          onSignOut={signOut}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <main className="p-4 lg:p-8 flex-1">
          <div className="max-w-7xl mx-auto space-y-8 lg:space-y-12">
            <RewardsHub user={user} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
