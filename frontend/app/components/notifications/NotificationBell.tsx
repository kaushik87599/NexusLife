"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full border border-white/10"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="font-bold text-white text-lg">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center text-gray-500">
                    <p>No new notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors group relative"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-white text-sm">
                          {notification.title}
                        </h4>
                        <span className="text-[10px] text-gray-500">
                          {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {notification.message}
                      </p>
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-white transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 bg-white/5 text-center">
                <button 
                  onClick={() => { setIsOpen(false); window.location.href = "/dashboard/reminders"; }}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Manage Reminders
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
