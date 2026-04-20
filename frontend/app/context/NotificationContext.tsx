"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Notification, fetchUnreadNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../lib/api/notifications";
import { useAuth } from "./AuthContext";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchUnreadNotifications();
      setNotifications(data);
      setUnreadCount(data.length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refresh();
      // Poll every 30 seconds
      const interval = setInterval(refresh, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, refresh]);

  const markAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refresh,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
