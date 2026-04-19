"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Event, EventCreate, EventUpdate } from "@/app/lib/api/events";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/app/components/Editor"), { 
  ssr: false,
  loading: () => <div className="h-[150px] w-full bg-white/5 animate-pulse rounded-xl" />
});

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
  const [tags, setTags] = useState("");
  const [color, setColor] = useState("#3b82f6"); // Default blue

  const PRESET_COLORS = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Emerald", value: "#10b981" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Orange", value: "#f97316" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Gray", value: "#64748b" },
  ];

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
        setTags(initialData.tags || "");
        setColor(initialData.color || "#3b82f6");
      } else {
        setTitle("");
        setDescription("");
        // If the calendar passes a specific date, set it, otherwise use current time
        const start = defaultStartTime ? new Date(defaultStartTime) : new Date();
        const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour by default
        setStartTime(formatForInput(start.toISOString()));
        setEndTime(formatForInput(end.toISOString()));
        setLocation("");
        setTags("");
        setColor("#3b82f6");
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
      tags: tags.trim() || undefined,
      color: color.trim() || undefined,
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-gray-900 border border-white/10 p-6 rounded-2xl z-50 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {initialData ? "Edit Event" : "Create Event"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Event Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                  required
                  placeholder="e.g. Design Sync"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Start Time *</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                    style={{ colorScheme: "dark" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">End Time *</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                    style={{ colorScheme: "dark" }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                    placeholder="Physical location or link"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Tags</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                    placeholder="Work, urgent, personal..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Event Color</label>
                <div className="flex flex-wrap items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(c.value)}
                        className={`w-6 h-6 rounded-full transition-all flex items-center justify-center ${color === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : 'hover:scale-110'}`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      >
                        {color === c.value && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="h-6 w-px bg-white/10 mx-1" />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-[10px] text-gray-500 font-mono">HEX</span>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="bg-transparent border-none p-0 text-gray-300 text-xs font-mono focus:outline-none w-full uppercase"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                <div className="min-h-[180px]">
                  <Editor 
                    initialContent={description} 
                    onChange={setDescription} 
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 mt-2 border-t border-white/10">
                {initialData && onDelete ? (
                  <button
                    type="button"
                    onClick={() => onDelete(initialData.id)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    Delete Event
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex gap-3">
                  <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-white/5 transition-all">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !title.trim() || !startTime || !endTime} 
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
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