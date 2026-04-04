"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Event, EventCreate, EventUpdate } from "@/app/lib/api/events";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventCreate | EventUpdate, eventId?: number) => Promise<void>;
  onDelete?: (eventId: number) => Promise<void>;
  isSubmitting: boolean;
  initialData?: Event | null; // Pass null for creating, Event object for editing
  defaultStartTime?: string; // e.g. from calendar date click
}

export const EventDialog: React.FC<EventDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  isSubmitting,
  initialData,
  defaultStartTime,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");

  // Helper to format ISO strings to datetime-local inputs
  const formatForInput = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description || "");
        setStartTime(formatForInput(initialData.start_time));
        setEndTime(formatForInput(initialData.end_time));
        setLocation(initialData.location || "");
      } else {
        setTitle("");
        setDescription("");
        // If the calendar passes a specific date, set it, otherwise use current time
        const start = defaultStartTime ? new Date(defaultStartTime) : new Date();
        const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour by default
        setStartTime(formatForInput(start.toISOString()));
        setEndTime(formatForInput(end.toISOString()));
        setLocation("");
      }
    }
  }, [isOpen, initialData, defaultStartTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime || !endTime) return;

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      location: location.trim() || undefined,
    };

    await onSubmit(payload, initialData?.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-gray-900 border border-white/20 p-6 rounded-2xl z-50 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {initialData ? "Edit Event" : "Create Event"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Event Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  required
                  placeholder="Doctor Appointment"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Start Time *</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                    style={{ colorScheme: "dark" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">End Time *</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                    style={{ colorScheme: "dark" }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  placeholder="123 Main St, or Zoom Link"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-400 resize-none h-24"
                  placeholder="Add any extra details..."
                />
              </div>

              <div className="flex justify-between pt-4 mt-2 border-t border-white/10">
                {initialData && onDelete ? (
                  <button
                    type="button"
                    onClick={() => onDelete(initialData.id)}
                    className="px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    Delete Event
                  </button>
                ) : (
                  <div /> /* Empty div to keep alignment */
                )}
                <div className="flex gap-3">
                  <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting || !title.trim() || !startTime || !endTime} className="px-5 py-2 rounded-lg text-sm bg-emerald-500 hover:bg-emerald-600 text-black font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {isSubmitting ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : null}
                    {initialData ? "Save Changes" : "Create Event"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};