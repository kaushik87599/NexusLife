"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { TimerDisplay } from "./TimerDisplay";
import { TimerControls } from "./TimerControls";
import { 
  startSession, 
  updateSession, 
  StudySession, 
  StudySessionCreate 
} from "@/app/lib/api/study_sessions";

const PRESETS = [
  { name: "Standard", work: 25, short: 5, long: 15 },
  { name: "Deep Work", work: 50, short: 10, long: 20 },
  { name: "Quick Focus", work: 15, short: 3, long: 10 },
];

const SESSIONS_UNTIL_LONG_BREAK = 4;

export const PomodoroTimer: React.FC = () => {
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionType, setSessionType] = useState<"work" | "short_break" | "long_break">("work");
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getDurationSeconds = (type: typeof sessionType) => {
    if (type === "work") return workDuration * 60;
    if (type === "short_break") return shortBreakDuration * 60;
    return longBreakDuration * 60;
  };

  const totalTime = getDurationSeconds(sessionType);
  const progress = (totalTime - timeLeft) / totalTime;

  const handleSessionEnd = useCallback(async () => {
    // [SOUND NOTIFICATION LOCATION]
    console.log("Timer ended! Play notification sound here.");

    if (currentSession) {
      await updateSession(currentSession.id, {
        status: "completed",
        end_time: new Date().toISOString(),
        duration: totalTime,
      });
      setCurrentSession(null);
    }

    let nextType: typeof sessionType = "work";
    let nextTime = workDuration * 60;

    if (sessionType === "work") {
      const nextCount = completedSessions + 1;
      setCompletedSessions(nextCount);
      
      if (nextCount % SESSIONS_UNTIL_LONG_BREAK === 0) {
        nextType = "long_break";
        nextTime = longBreakDuration * 60;
      } else {
        nextType = "short_break";
        nextTime = shortBreakDuration * 60;
      }
    } else {
      nextType = "work";
      nextTime = workDuration * 60;
    }
    
    setSessionType(nextType);
    setTimeLeft(nextTime);
    setIsActive(false);
    setIsPaused(false);
  }, [currentSession, sessionType, completedSessions, totalTime, workDuration, shortBreakDuration, longBreakDuration]);

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionEnd();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, timeLeft, handleSessionEnd]);

  // Update timeLeft if durations change while not active
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(getDurationSeconds(sessionType));
    }
  }, [workDuration, shortBreakDuration, longBreakDuration, sessionType, isActive]);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    if (isActive && !confirm("Current session will be reset. Continue?")) return;
    
    setWorkDuration(preset.work);
    setShortBreakDuration(preset.short);
    setLongBreakDuration(preset.long);
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(preset.work * 60);
    setSessionType("work");
    setShowCustom(false);
  };

  const handleStart = async () => {
    try {
      const data: StudySessionCreate = {
        session_type: sessionType,
      };
      const session = await startSession(data);
      setCurrentSession(session);
      setIsActive(true);
      setIsPaused(false);
    } catch (err) {
      console.error("Failed to start session", err);
    }
  };

  const handlePause = async () => {
    setIsPaused(true);
    if (currentSession) {
      await updateSession(currentSession.id, {
        status: "paused",
      });
    }
  };

  const handleResume = async () => {
    setIsPaused(false);
    if (currentSession) {
      await updateSession(currentSession.id, {
        status: "active",
      });
    }
  };

  const handleStop = async () => {
    if (confirm("Stop session? Current progress will not be fully recorded.")) {
      if (currentSession) {
        await updateSession(currentSession.id, {
          status: "interrupted",
          end_time: new Date().toISOString(),
          duration: totalTime - timeLeft,
        });
        setCurrentSession(null);
      }
      setIsActive(false);
      setIsPaused(false);
      setTimeLeft(totalTime);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      {/* Presets */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              !showCustom && workDuration === preset.work 
                ? "bg-emerald-500 text-black" 
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {preset.name}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            showCustom 
              ? "bg-emerald-500 text-black" 
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          Custom
        </button>
      </div>

      {showCustom && (
        <div className="flex gap-4 mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col items-center">
            <label className="text-xs text-gray-500 uppercase mb-1">Work</label>
            <input 
              type="number" 
              value={workDuration} 
              onChange={(e) => setWorkDuration(Number(e.target.value))}
              className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-center text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-xs text-gray-500 uppercase mb-1">Break</label>
            <input 
              type="number" 
              value={shortBreakDuration} 
              onChange={(e) => setShortBreakDuration(Number(e.target.value))}
              className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-center text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-xs text-gray-500 uppercase mb-1">Long Break</label>
            <input 
              type="number" 
              value={longBreakDuration} 
              onChange={(e) => setLongBreakDuration(Number(e.target.value))}
              className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-center text-white focus:border-emerald-500 outline-none"
            />
          </div>
        </div>
      )}

      <TimerDisplay 
        minutes={Math.floor(timeLeft / 60)} 
        seconds={timeLeft % 60} 
        label={sessionType.replace("_", " ")}
        progress={progress}
      />
      
      <TimerControls 
        isActive={isActive}
        isPaused={isPaused}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
      />

      <div className="mt-8 flex gap-2">
        {[...Array(SESSIONS_UNTIL_LONG_BREAK)].map((_, i) => (
          <div 
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < (completedSessions % SESSIONS_UNTIL_LONG_BREAK) 
                ? "bg-emerald-500" 
                : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
