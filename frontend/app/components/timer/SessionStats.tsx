import React from "react";
import { StudySessionStats } from "@/app/lib/api/study_sessions";

interface SessionStatsProps {
  stats: StudySessionStats | null;
}

export const SessionStats: React.FC<SessionStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
        <div className="text-3xl font-bold text-emerald-400">{stats.total_focus_minutes}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Focus Minutes Today</div>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
        <div className="text-3xl font-bold text-white">{stats.total_sessions}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Sessions Completed</div>
      </div>
    </div>
  );
};
