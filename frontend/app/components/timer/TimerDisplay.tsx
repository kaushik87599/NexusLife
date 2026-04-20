import React from "react";
import { motion } from "framer-motion";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  label: string;
  progress: number; // 0 to 1
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ minutes, seconds, label, progress }) => {
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Outer Circle (Progress) */}
      <svg className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          className="stroke-white/10 fill-none"
          strokeWidth="8"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="45%"
          className="stroke-emerald-500 fill-none"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </svg>

      {/* Timer Text */}
      <div className="absolute flex flex-col items-center text-center">
        <motion.span 
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400 mb-2"
        >
          {label}
        </motion.span>
        <span className="text-6xl md:text-7xl font-bold tracking-tight text-white tabular-nums">
          {formattedMinutes}:{formattedSeconds}
        </span>
      </div>
    </div>
  );
};
