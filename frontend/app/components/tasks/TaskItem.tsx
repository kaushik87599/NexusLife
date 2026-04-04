"use client";

import React from "react";
import { motion } from "framer-motion";
import { Task } from "@/app/lib/api/tasks";

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: number, currentStatus: string) => void;
  onDelete: (id: number) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-500/20 text-red-500 border-red-500/30";
    case "medium":
      return "bg-amber-500/20 text-amber-500 border-amber-500/30";
    case "low":
    default:
      return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";
  }
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleStatus, onDelete }) => {
  const isCompleted = task.status === "completed";
  const priorityStyle = getPriorityColor(task.priority);

  // Overdue logic
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isCompleted;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative p-4 rounded-xl border backdrop-blur-md transition-all duration-300 ${
        isCompleted 
          ? "bg-white/5 border-white/10 opacity-60" 
          : "bg-white/10 border-white/20 hover:bg-white/15"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <button 
          onClick={() => onToggleStatus(task.id, task.status)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
            isCompleted ? "border-emerald-500 bg-emerald-500 text-black" : "border-gray-400 hover:border-emerald-400"
          }`}
        >
          {isCompleted && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium transition-colors ${
            isCompleted ? "text-gray-400 line-through" : "text-white"
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm ${isCompleted ? "text-gray-500" : "text-gray-300"}`}>
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`text-xs px-2 py-1 rounded-md border ${priorityStyle}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </span>
            {task.due_date && (
              <span className={`text-xs px-2 py-1 rounded-md border ${
                isOverdue 
                  ? "bg-red-500/20 text-red-400 border-red-500/30" 
                  : "bg-blue-500/10 text-blue-300 border-blue-500/20"
              }`}>
                Due: {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 text-gray-400 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};
