"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Reminder, 
  ReminderCreate, 
  fetchReminders, 
  createReminder, 
  deleteReminder 
} from "@/app/lib/api/reminders";
import { DashboardHeader } from "@/app/components/layout/DashboardHeader";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Bell, Plus, Trash2, Calendar, Clock, AlertCircle } from "lucide-react";

export default function RemindersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [triggerTime, setTriggerTime] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const loadReminders = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await fetchReminders();
      setReminders(data);
    } catch (err: any) {
      setError(err.message || "Failed to load reminders");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !triggerTime) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const newReminder = await createReminder({
        title,
        description,
        trigger_time: new Date(triggerTime).toISOString(),
      });
      setReminders(prev => [newReminder, ...prev]);
      setTitle("");
      setDescription("");
      setTriggerTime("");
    } catch (err: any) {
      setError(err.message || "Failed to create reminder");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReminder(id);
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete reminder");
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6 md:px-12 overflow-hidden relative">
      <DashboardHeader />
      
      {/* Background gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Reminders
            </h1>
            <p className="mt-2 text-gray-400 text-lg">
              Set alerts for your tasks and never miss a deadline.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Create Reminder Form */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                New Reminder
              </h2>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g., Meeting with team"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Time</label>
                  <input
                    type="datetime-local"
                    value={triggerTime}
                    onChange={(e) => setTriggerTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add more details..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm resize-none h-24"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Creating..." : (
                    <>
                      <Bell className="w-4 h-4" />
                      Set Reminder
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Reminders List */}
          <div className="md:col-span-2">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : reminders.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400">No upcoming reminders</h3>
                <p className="text-gray-600 text-sm">Stay on top of your schedule by setting one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {reminders.map((reminder) => (
                    <motion.div
                      key={reminder.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`group relative bg-white/5 border rounded-2xl p-6 hover:bg-white/[0.08] transition-all ${reminder.is_triggered ? 'border-white/5 opacity-50' : 'border-white/10'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${reminder.is_triggered ? 'bg-gray-500/10 text-gray-500' : 'bg-blue-500/10 text-blue-400'}`}>
                            <Bell className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className={`font-bold text-lg ${reminder.is_triggered ? 'text-gray-500 line-through' : 'text-white'}`}>
                              {reminder.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(reminder.trigger_time).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(reminder.trigger_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            {reminder.description && (
                              <p className="text-sm text-gray-400 mt-3 line-clamp-2 italic">
                                "{reminder.description}"
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDelete(reminder.id)}
                          className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {reminder.is_triggered && (
                        <div className="absolute top-4 right-12">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 bg-white/5 px-2 py-1 rounded">
                            Triggered
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
