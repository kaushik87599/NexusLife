"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Note, NoteCreate, NoteUpdate } from "@/app/lib/api/notes";
import { X, Save, Trash2, Pin, Tag, Palette } from "lucide-react";

const Editor = dynamic(() => import("@/app/components/Editor"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl" />
});

interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NoteCreate | NoteUpdate, id?: number) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  isSubmitting: boolean;
  initialData?: Note | null;
}

export const NoteDialog: React.FC<NoteDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  isSubmitting,
  initialData,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [isPinned, setIsPinned] = useState(false);

  const PRESET_COLORS = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Emerald", value: "#10b981" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Orange", value: "#f97316" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Gray", value: "#64748b" },
  ];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setContent(initialData.content || "");
        setTags(initialData.tags || "");
        setColor(initialData.color || "#3b82f6");
        setIsPinned(initialData.is_pinned || false);
      } else {
        setTitle("");
        setContent("");
        setTags("");
        setColor("#3b82f6");
        setIsPinned(false);
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      content: content.trim() || undefined,
      tags: tags.trim() || undefined,
      color: color.trim() || undefined,
      is_pinned: isPinned,
    };

    await onSubmit(payload, initialData?.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-gray-900 border border-white/10 rounded-3xl z-[70] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`p-2 rounded-lg transition-all ${isPinned ? 'bg-amber-500/20 text-amber-500' : 'text-gray-400 hover:bg-white/5'}`}
                >
                  <Pin className="w-5 h-5" fill={isPinned ? "currentColor" : "none"} />
                </button>
                <div className="h-6 w-px bg-white/10" />
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
                  {initialData ? "Editing Note" : "Drafting New Note"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:bg-white/10 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col p-8 space-y-6 custom-scrollbar">
              {/* Title Section */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title..."
                className="w-full bg-transparent text-4xl font-bold text-white placeholder:text-gray-700 outline-none border-none p-0"
                autoFocus
              />

              {/* Metadata Toolbar */}
              <div className="flex flex-wrap gap-4 items-center py-2 border-y border-white/5">
                <div className="flex items-center gap-2 text-gray-400">
                  <Tag className="w-4 h-4" />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Add tags..."
                    className="bg-transparent border-none text-sm outline-none placeholder:text-gray-600 w-32"
                  />
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-gray-400" />
                  <div className="flex gap-1.5">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(c.value)}
                        className={`w-4 h-4 rounded-full border border-white/10 transition-all ${color === c.value ? 'ring-2 ring-white scale-125' : 'hover:scale-110'}`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Editor Section */}
              <div className="flex-1 min-h-[400px]">
                <Editor 
                  initialContent={content} 
                  onChange={setContent} 
                />
              </div>
            </form>

            {/* Footer */}
            <div className="p-4 bg-black/40 border-t border-white/10 flex justify-between items-center">
              {initialData && onDelete ? (
                <button
                  type="button"
                  onClick={() => onDelete(initialData.id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-medium text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Discard Note
                </button>
              ) : (
                <div />
              )}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-gray-400 hover:text-white transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !title.trim()}
                  className="flex items-center gap-2 px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
                >
                  <Save className="w-5 h-5" />
                  {isSubmitting ? "Writing..." : initialData ? "Save Record" : "Finalize Note"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
