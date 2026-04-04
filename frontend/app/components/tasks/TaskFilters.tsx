"use client";

import React from "react";

interface TaskFiltersProps {
  currentStatus: string;
  currentPriority: string;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentStatus,
  currentPriority,
  onStatusChange,
  onPriorityChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-6 gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => onStatusChange("")}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            currentStatus === "" ? "bg-white/20 text-white font-medium shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => onStatusChange("pending")}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            currentStatus === "pending" ? "bg-white/20 text-white font-medium shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => onStatusChange("completed")}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            currentStatus === "completed" ? "bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30" : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          Completed
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Priority:</span>
        <select
          value={currentPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-emerald-400"
        >
          <option value="">Any</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
};
