import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  LogOut,
  MoreHorizontal,
  Smile,
  X,
  AlertCircle,
  Mail,
  Trash2,
  Menu,
} from "lucide-react";

const Header = ({ title, subtitle, onSignOut, onMenuClick }) => {
  console.log("Header Title Prop:", title);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const notificationRef = useRef(null);

  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      title: "Welcome, Oladimeji !",
      message:
        "We're thrilled to have you on board! Explore powerful tools, build your personal stack, and start unlocking rewards through daily streaks, referrals, and more. Your journey to smarter productivity starts here.",
      time: "1d ago",
      read: false,
    },
  ]);

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setNotificationsList((prev) => prev.filter((n) => n.id !== id));
    setActiveMenuId(null);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowNotifications(false);
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 w-full">
      <div className="px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex items-center justify-between min-h-[40px]">
          <div className="flex items-center gap-3 min-w-0">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div className="flex flex-col">
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900">
                {title || "TITLE MISSING"}
              </h1>
              {subtitle && (
                <p className="hidden md:block text-gray-500 text-sm">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-full transition-colors ${
                  showNotifications ? "bg-purple-100" : "hover:bg-gray-100"
                }`}
              >
                <Bell
                  className={`w-5 h-5 lg:w-6 lg:h-6 ${
                    showNotifications ? "text-purple-600" : "text-gray-700"
                  }`}
                  strokeWidth={2}
                />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 lg:w-5 lg:h-5 bg-red-500 text-white text-[10px] lg:text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="fixed lg:absolute right-4 lg:right-0 mt-3 w-[calc(100vw-32px)] sm:w-[400px] lg:w-[500px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 p-4 flex justify-between items-center text-white">
                    <span className="font-bold text-base lg:text-lg">
                      Notifications
                    </span>
                    <div className="text-[10px] lg:text-xs font-medium space-x-3 opacity-90">
                      <button
                        onClick={markAllAsRead}
                        className="hover:underline"
                      >
                        Mark all read
                      </button>
                      <button
                        onClick={() => setNotificationsList([])}
                        className="hover:underline"
                      >
                        Delete All
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[60vh] lg:max-h-[400px] overflow-y-auto">
                    {notificationsList.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group relative ${
                          !notif.read ? "bg-purple-50/30" : ""
                        }`}
                      >
                        <div className="flex gap-3 lg:gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <Smile className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4
                                className={`text-xs lg:text-sm font-bold truncate pr-2 ${
                                  notif.read ? "text-gray-600" : "text-gray-900"
                                }`}
                              >
                                {notif.title}
                              </h4>
                              <button
                                onClick={(e) => toggleMenu(e, notif.id)}
                                className="text-gray-400 p-1"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs lg:text-sm text-gray-600 line-clamp-2 mt-1">
                              {notif.message}
                            </p>
                            <span className="text-[10px] lg:text-xs text-gray-400 mt-2 block">
                              {notif.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {notificationsList.length === 0 && (
                      <div className="p-8 text-center text-gray-500 text-sm">
                        No new notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {onSignOut && (
              <button
                onClick={() => setShowSignOutModal(true)}
                className="flex items-center space-x-2 p-2 lg:px-4 lg:py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {selectedNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
            <div className="p-4 lg:p-6 flex items-start justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 truncate">
                  {selectedNotification.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                {selectedNotification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {showSignOutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in duration-200">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 lg:w-8 lg:h-8 text-red-600" />
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
              Sign Out?
            </h3>
            <p className="text-sm lg:text-base text-gray-600 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignOutModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignOutModal(false);
                  onSignOut();
                }}
                className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl shadow-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
