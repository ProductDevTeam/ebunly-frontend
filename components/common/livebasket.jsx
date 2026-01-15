"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingCart,
  Package,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

/**
 * LiveBasket Component - Dynamic Island style notification system
 *
 * @param {boolean} isExpanded - Controls whether the basket is expanded
 * @param {function} onToggle - Callback when basket is toggled
 * @param {array} notifications - Array of notification objects
 * @param {function} onDismiss - Callback when a notification is dismissed
 */
export default function LiveBasket({
  isExpanded = false,
  onToggle,
  notifications = [],
  onDismiss,
}) {
  const [isLive, setIsLive] = useState(false);

  // Simulate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Compact Button */}
      <motion.button
        onClick={onToggle}
        className="w-40 bg-linear-to-r from-[#3d2c2e] via-[#5d3a3a] to-[#4a3032] hover:from-[#4a3335] hover:via-[#6d4040] hover:to-[#4a3335] text-white px-4 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 relative overflow-hidden"
        whileTap={{ scale: 0.98 }}
      >
        {/* Live indicator */}
        <div className="relative flex items-center space-x-2">
          <motion.div
            className="w-2 h-2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"
            animate={{
              scale: isLive ? [1, 1.2, 1] : 1,
              opacity: isLive ? [1, 0.8, 1] : 1,
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm font-medium">Live Basket</span>
        </div>

        {/* Notification badge */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {notifications.length}
          </motion.div>
        )}
      </motion.button>

      {/* Expanded Notification Panel - Dynamic Island Style */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute left-0 right-0 mt-2 bg-linear-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <h3 className="text-white font-semibold text-sm">
                  Live Updates
                </h3>
              </div>
              <button
                onClick={onToggle}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No active updates</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDismiss={() => onDismiss(notification.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Individual Notification Item
 */
function NotificationItem({ notification, onDismiss }) {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "cart":
        return <ShoppingCart className="w-4 h-4 text-blue-400" />;
      default:
        return <Package className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 hover:bg-gray-700/50 transition-colors group"
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-medium mb-1">
            {notification.title}
          </p>
          <p className="text-gray-400 text-xs line-clamp-2">
            {notification.message}
          </p>
          {notification.timestamp && (
            <p className="text-gray-500 text-xs mt-1">
              {formatTimestamp(notification.timestamp)}
            </p>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Format timestamp to relative time
 */
function formatTimestamp(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now - time) / 1000); // seconds

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
