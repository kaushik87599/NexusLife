"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskCreate } from "@/app/lib/api/tasks";

interface TaskFormProps {
  onSubmit: (task: TaskCreate) => Promise<void>;
  isSubmitting: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isSubmitting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      ...(dueDate ? { due_date: new Date(dueDate).toISOString() } : {})
    });

    setTitle("");
    setDescription("");
    setPriority("low");
    setDueDate("");
    setIsOpen(false);
  };

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 rounded-xl border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 text-gray-300 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Task
        </button>
      ) : (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 pb-2 text-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-colors"
              required
            />
          </div>
          
          <div>
            <textarea
              placeholder="Add details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/20 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none h-20"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs text-gray-400 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs text-gray-400 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-emerald-400 style-color-scheme-dark"
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-2 rounded-lg text-sm bg-emerald-500 hover:bg-emerald-600 text-black font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : null}
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};
