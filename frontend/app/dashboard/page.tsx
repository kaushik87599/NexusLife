"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { DashboardHeader } from "@/app/components/layout/DashboardHeader";
import { SummaryCard } from "@/app/components/dashboard/SummaryCard";
import { getDashboardData } from "@/app/lib/api/dashboard";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const dashboardData = await getDashboardData();
      console.log("Dashboard Data received:", dashboardData);
      setData(dashboardData);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6 md:px-12 relative overflow-x-hidden">
      <DashboardHeader />
      
      {/* Background Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">{user.email?.split('@')[0]}</span>
              </h1>
              <p className="mt-2 text-gray-400 text-lg">
                {format(new Date(), "EEEE, MMMM do")} — Here's what's on your plate today.
              </p>
            </div>
            <button 
              onClick={loadDashboardData}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all flex items-center gap-2"
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </motion.div>
        </header>

        {isLoading && !data ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-12 h-12 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-2xl mb-10 flex justify-between items-center">
            <div>
              <h3 className="font-bold">Error loading dashboard</h3>
              <p>{error}</p>
            </div>
            <button onClick={loadDashboardData} className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium">Retry</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* MAIN COLUMN (LEFT + CENTER) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* NOW & NEXT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SummaryCard 
                  title="Current Activity" 
                  delay={0.1}
                  icon={<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                  className="bg-gradient-to-br from-white/[0.05] to-emerald-500/[0.05]"
                >
                  {data?.current_event ? (
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{data.current_event.title}</h4>
                      <p className="text-gray-400 text-sm mb-4">
                        {format(new Date(data.current_event.start_time), "p")} - {format(new Date(data.current_event.end_time), "p")}
                      </p>
                      <Link href="/dashboard/calendar" className="text-emerald-400 text-xs font-bold hover:underline">VIEW CALENDAR →</Link>
                    </div>
                  ) : (
                    <div className="py-2">
                      <p className="text-gray-500 italic">No active events right now.</p>
                      <Link href="/dashboard/calendar" className="text-blue-400 text-xs font-bold hover:underline mt-4 inline-block">SCHEDULE SOMETHING →</Link>
                    </div>
                  )}
                </SummaryCard>

                <SummaryCard title="Up Next" delay={0.2}>
                  {data?.next_event ? (
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{data.next_event.title}</h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Starts at {format(new Date(data.next_event.start_time), "p")}
                      </p>
                      <Link href="/dashboard/calendar" className="text-blue-400 text-xs font-bold hover:underline">VIEW SCHEDULE →</Link>
                    </div>
                  ) : (
                    <div className="py-2">
                      <p className="text-gray-500 italic">Clear schedule for the rest of the day.</p>
                    </div>
                  )}
                </SummaryCard>
              </div>

              {/* TASKS WIDGET */}
              <SummaryCard title="Priority Tasks" delay={0.3} icon={<Link href="/dashboard/tasks" className="text-xs text-blue-400 hover:underline">VIEW ALL</Link>}>
                <div className="space-y-3">
                  {data?.tasks && data.tasks.length > 0 ? (
                    data.tasks.map((task: any) => (
                      <div key={task.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                        <div className={`w-1.5 h-8 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500' : 
                          task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{task.title}</h4>
                          <p className="text-xs text-gray-500">
                            {task.due_date ? `Due ${format(new Date(task.due_date), "MMM d, p")}` : 'No due date'}
                          </p>
                        </div>
                        {new Date(task.due_date) < new Date() && task.status !== 'completed' && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Overdue</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
                      <p className="text-gray-500 text-sm">All caught up! No pending tasks.</p>
                    </div>
                  )}
                </div>
              </SummaryCard>

              {/* SCHEDULE TIMELINE */}
              <SummaryCard title="Today's Schedule" delay={0.4} icon={<Link href="/dashboard/calendar" className="text-xs text-blue-400 hover:underline">FULL CALENDAR</Link>}>
                <div className="relative pl-4 space-y-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-white/10">
                  {data?.schedule && data.schedule.length > 0 ? (
                    data.schedule.map((event: any) => (
                      <div key={event.id} className="relative">
                        <div className="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-4 border-black" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                            {format(new Date(event.start_time), "p")} - {format(new Date(event.end_time), "p")}
                          </span>
                          <h4 className="text-sm font-semibold text-white">{event.title}</h4>
                          {event.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{event.description}</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4">
                      <p className="text-gray-500 text-sm italic">Nothing scheduled for today.</p>
                    </div>
                  )}
                </div>
              </SummaryCard>

            </div>

            {/* SIDEBAR COLUMN (RIGHT) */}
            <div className="space-y-8">
              
              {/* QUICK ACTIONS */}
              <div className="bg-gradient-to-br from-blue-600/20 to-emerald-600/20 rounded-2xl p-6 border border-white/10">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/dashboard/tasks" className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium">Add Task</span>
                  </Link>
                  <Link href="/dashboard/timer" className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium">Start Timer</span>
                  </Link>
                  <Link href="/dashboard/calendar" className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium">Add Event</span>
                  </Link>
                  <Link href="/dashboard/notes" className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium">New Note</span>
                  </Link>
                </div>
              </div>

              {/* STUDY STATS */}
              <SummaryCard title="Study Stats" delay={0.5}>
                <div className="text-center">
                  <div className="text-5xl font-black text-white mb-1">
                    {data?.study_stats?.total_focus_minutes || 0}
                  </div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">Minutes Focused Today</div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="text-lg font-bold text-emerald-400">{data?.study_stats?.total_sessions || 0}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold">Sessions</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="text-lg font-bold text-blue-400">
                        {Math.round((data?.study_stats?.total_focus_minutes || 0) / 25 * 10) / 10}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold">Pomodoros</div>
                    </div>
                  </div>
                </div>
              </SummaryCard>

              {/* NOTIFICATIONS */}
              <SummaryCard title="Recent Alerts" delay={0.6} icon={data?.unread_count > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{data.unread_count}</span>}>
                <div className="space-y-4">
                  {data?.unread_notifications && data.unread_notifications.length > 0 ? (
                    data.unread_notifications.map((notif: any) => (
                      <div key={notif.id} className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                        <div>
                          <h5 className="text-xs font-semibold text-white line-clamp-1">{notif.title}</h5>
                          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                          <span className="text-[9px] text-gray-600 mt-1 block">{format(new Date(notif.created_at), "p")}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-2">
                      <p className="text-gray-500 text-xs italic">No new notifications.</p>
                    </div>
                  )}
                  <Link href="/dashboard/reminders" className="block text-center text-[10px] font-bold text-gray-500 hover:text-white transition-colors pt-2 uppercase tracking-widest">
                    Manage Reminders
                  </Link>
                </div>
              </SummaryCard>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
