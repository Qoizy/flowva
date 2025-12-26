import React, { useState } from "react";
import {
  Home,
  Compass,
  Library,
  Layers,
  CreditCard,
  Gift,
  Settings,
  Menu,
  X,
  Bell,
} from "lucide-react";
import logo from "../assets/logo.png";

const Sidebar = ({
  activeRoute = "rewards",
  user,
  handleNavigation,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const menuItems = [
    { id: "home", label: "Home", icon: Home, path: "/home" },
    { id: "discover", label: "Discover", icon: Compass, path: "/discover" },
    { id: "library", label: "Library", icon: Library, path: "/library" },
    {
      id: "tech-stack",
      label: "Tech Stack",
      icon: Layers,
      path: "/tech-stack",
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      icon: CreditCard,
      path: "/subscriptions",
    },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-gray-600"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-2">
          <img src={logo} alt="Flowva" className="h-8 w-auto hidden md:block" />
        </div>

        <button className="p-2 text-gray-600 relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
        </button>
      </div> */}

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      <div
        className={`
        w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-[70]
        transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="lg:hidden absolute top-4 right-4">
          <button onClick={closeMenu} className="p-2 text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Flowva" className="w-full h-auto" />
          </div>
        </div>

        <nav className="flex-1 px-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  handleNavigation(item.path);
                  closeMenu();
                }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              handleNavigation("/rewards");
              closeMenu();
            }}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg mb-1 transition-all mt-2 ${
              activeRoute === "rewards"
                ? "ring-2 ring-purple-400 shadow-sm"
                : ""
            }`}
            style={{
              background: "linear-gradient(135deg, #E9D5FF 0%, #DBEAFE 100%)",
              color: "#7C3AED",
            }}
          >
            <Gift className="w-5 h-5" />
            <span className="font-semibold">Rewards Hub</span>
          </button>

          <button
            onClick={() => {
              handleNavigation("/settings");
              closeMenu();
            }}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg mb-1 text-gray-700 hover:bg-gray-100 transition-colors mt-2"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-md font-bold shrink-0"
              style={{ backgroundColor: "#FF6347" }}
            >
              {user?.email ? user.email.charAt(0).toUpperCase() : "O"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.full_name || "Oladimeji"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "oladimejiquyum30@gm..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
