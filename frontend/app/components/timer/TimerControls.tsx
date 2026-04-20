import React from "react";
import { motion } from "framer-motion";

interface TimerControlsProps {
  isActive: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isActive,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
}) => {
  return (
    <div className="flex items-center gap-6 mt-12">
      {!isActive ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-10 py-4 bg-emerald-500 text-black font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
        >
          START SESSION
        </motion.button>
      ) : (
        <>
          {isPaused ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResume}
              className="w-16 h-16 flex items-center justify-center bg-emerald-500 text-black rounded-full shadow-lg"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPause}
              className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full shadow-lg"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStop}
            className="w-16 h-16 flex items-center justify-center bg-red-500/20 border border-red-500/50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          </motion.button>
        </>
      )}
    </div>
  );
};
