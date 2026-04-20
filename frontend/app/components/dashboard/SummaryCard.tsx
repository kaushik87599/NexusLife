"use client";

import React from "react";
import { motion } from "framer-motion";

interface SummaryCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function SummaryCard({ title, icon, children, className = "", delay = 0 }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all ${className}`}
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
}
