"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Event, 
  EventCreate, 
  EventUpdate, 
  fetchEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from "@/app/lib/api/events";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Calendar } from "./components/Calendar";
import { EventDialog } from "./components/EventDialog";

export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [defaultStartTime, setDefaultStartTime] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const loadEvents = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      // You can implement date range fetching here if needed
      const data = await fetchEvents();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleOpenCreate = (startStr?: string) => {
    setSelectedEvent(null);
    setDefaultStartTime(startStr);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsDialogOpen(true);
    }
  };

  const handleSubmitEvent = async (data: EventCreate | EventUpdate, eventId?: number) => {
    setIsSubmitting(true);
    try {
      if (eventId) {
        const updated = await updateEvent(eventId, data as EventUpdate);
        setEvents(prev => prev.map(e => e.id === eventId ? updated : e));
      } else {
        const created = await createEvent(data as EventCreate);
        setEvents(prev => [...prev, created]);
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    setIsSubmitting(true);
    try {
      await deleteEvent(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to delete event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 overflow-hidden relative">
      {/* Background gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400"
            >
              Scheduler
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-gray-400 text-lg"
            >
              Organize your time and track your commitments.
            </motion.p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenCreate()}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 w-fit"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Event
          </motion.button>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex justify-between items-center">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-40 bg-white/5 border border-white/10 rounded-2xl">
              <div className="w-10 h-10 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <Calendar 
              events={events}
              onDateClick={handleOpenCreate}
              onEventClick={handleOpenEdit}
            />
          )}
        </motion.div>
      </div>

      <EventDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmitEvent}
        onDelete={handleDeleteEvent}
        isSubmitting={isSubmitting}
        initialData={selectedEvent}
        defaultStartTime={defaultStartTime}
      />
    </div>
  );
}
