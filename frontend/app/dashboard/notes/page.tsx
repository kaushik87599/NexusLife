"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { notesApi, Note, NoteCreate, NoteUpdate } from "@/app/lib/api/notes";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { NoteDialog } from "./components/NoteDialog";
import { Plus, Search, Filter, Pin, Clock, Tag as TagIcon, MoreVertical, Edit3, Trash2 } from "lucide-react";
import { DashboardHeader } from "@/app/components/layout/DashboardHeader";

export default function NotesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const fetchNotes = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await notesApi.fetchNotes();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateOrUpdate = async (data: NoteCreate | NoteUpdate, id?: number) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await notesApi.updateNote(id, data as NoteUpdate);
      } else {
        await notesApi.createNote(data as NoteCreate);
      }
      setIsDialogOpen(false);
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      await notesApi.deleteNote(id);
      setIsDialogOpen(false);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           note.tags?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !filterTag || note.tags?.includes(filterTag);
      return matchesSearch && matchesTag;
    });
  }, [notes, searchQuery, filterTag]);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    notes.forEach(note => {
      note.tags?.split(',').forEach(tag => {
        const trimmed = tag.trim();
        if (trimmed) tagsSet.add(trimmed);
      });
    });
    return Array.from(tagsSet);
  }, [notes]);
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6 md:px-12">
      <DashboardHeader />
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Notebook
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Capture ideas, draft plans, and organize your mind.</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setSelectedNote(null); setIsDialogOpen(true); }}
          className="flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-white/5 transition-all"
        >
          <Plus className="w-5 h-5" />
          New Thought
        </motion.button>
      </header>

      {/* Controls Section */}
      <section className="flex flex-wrap items-center gap-4 mb-10">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search notes or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-white/10 transition-all text-gray-300"
          />
        </div>

        <div className="flex gap-2">
          {allTags.slice(0, 5).map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${filterTag === tag ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'}`}
            >
              {tag}
            </button>
          ))}
          {allTags.length > 5 && (
            <button className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:border-white/30 transition-all">
              +{allTags.length - 5} More
            </button>
          )}
        </div>
      </section>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse border border-white/10" />
          ))}
        </div>
      ) : filteredNotes.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                onClick={() => { setSelectedNote(note); setIsDialogOpen(true); }}
                className="group relative bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:bg-white/[0.08] transition-all cursor-pointer flex flex-col justify-between min-h-[220px]"
                style={{ borderColor: `${note.color}40` }}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${note.color}20`, color: note.color }}
                    >
                      {note.is_pinned ? <Pin className="w-5 h-5 fill-current" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-xl transition-all text-gray-500">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                    {note.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm line-clamp-3 font-medium">
                    {/* Simplified preview of content */}
                    {note.content?.includes("type") ? "Rich content available..." : note.content || "Empty thought."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {note.tags?.split(',').slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-white/10 border border-white/10 rounded-md text-[10px] font-bold text-gray-400 capitalize">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-24">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-3xl border border-white/10 mb-6">
            <Edit3 className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-400">No notes found</h2>
          <p className="text-gray-600 mt-2">Start by capturing your first thought today.</p>
        </div>
      )}

      {/* Dialogs */}
      <NoteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateOrUpdate}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
        initialData={selectedNote}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
