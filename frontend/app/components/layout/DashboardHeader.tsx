"use client";

import React from "react";
import { NotificationBell } from "../notifications/NotificationBell";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold text-white flex items-center">
             <span className="text-blue-400 mr-1">Nexus</span>Life
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Dashboard</Link>
            <Link href="/dashboard/tasks" className="text-sm text-gray-400 hover:text-white transition-colors">Tasks</Link>
            <Link href="/dashboard/calendar" className="text-sm text-gray-400 hover:text-white transition-colors">Calendar</Link>
            <Link href="/dashboard/notes" className="text-sm text-gray-400 hover:text-white transition-colors">Notes</Link>
            <Link href="/dashboard/timer" className="text-sm text-gray-400 hover:text-white transition-colors">Timer</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />
          <div className="h-8 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-white truncate max-w-[150px]">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
