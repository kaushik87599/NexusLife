"use client";

import { DashboardHeader } from "@/app/components/layout/DashboardHeader";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { PomodoroTimer } from "@/app/components/timer/PomodoroTimer";
import { SessionStats } from "@/app/components/timer/SessionStats";
import { fetchStats, StudySessionStats } from "@/app/lib/api/study_sessions";

export default function TimerPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<StudySessionStats | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const loadStats = async () => {
        try {
          const data = await fetchStats();
          setStats(data);
        } catch (err) {
          console.error("Failed to load stats", err);
        }
      };
      loadStats();
      
      // Refresh stats every minute or when a session completes
      const interval = setInterval(loadStats, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6 md:px-12 overflow-hidden relative">
      <DashboardHeader />
      {/* Background gradients ... */}
      {/* Background gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        <header className="mb-12 text-center w-full">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400"
          >
            Deep Focus
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-gray-400 text-lg"
          >
            Unlock your peak performance with Pomodoro.
          </motion.p>
        </header>

        <div className="w-full flex flex-col items-center gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <PomodoroTimer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full flex justify-center"
          >
            <SessionStats stats={stats} />
          </motion.div>
        </div>

        {/* Navigation back to dashboard */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => router.push("/dashboard/tasks")}
          className="mt-16 text-gray-500 hover:text-white transition flex items-center gap-2 group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </motion.button>
      </div>
    </div>
  );
}
