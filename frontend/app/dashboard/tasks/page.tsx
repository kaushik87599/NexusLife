"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Task, 
  TaskCreate, 
  TaskUpdate, 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask 
} from "@/app/lib/api/tasks";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { TaskItem } from "@/app/components/tasks/TaskItem";
import { TaskForm } from "@/app/components/tasks/TaskForm";
import { TaskFilters } from "@/app/components/tasks/TaskFilters";

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const loadTasks = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTasks({ 
        status: statusFilter || undefined, 
        priority: priorityFilter || undefined 
      });
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = async (taskData: TaskCreate) => {
    setIsSubmitting(true);
    try {
      const newTask = await createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    
    // Optimistic UI update
    setTasks((prev) => 
      prev.map(task => 
        task.id === id ? { ...task, status: newStatus } : task
      )
    );

    try {
      await updateTask(id, { status: newStatus });
    } catch (err: any) {
      // Revert on fail
      setTasks((prev) => 
        prev.map(task => 
          task.id === id ? { ...task, status: currentStatus } : task
        )
      );
      setError(err.message || "Failed to update task status");
    }
  };

  const handleDeleteTask = async (id: number) => {
    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter(task => task.id !== id));

    try {
      await deleteTask(id);
    } catch (err: any) {
      // Revert on fail
      setTasks(previousTasks);
      setError(err.message || "Failed to delete task");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 overflow-hidden relative">
      {/* Background gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400"
          >
            Tasks
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-gray-400 text-lg"
          >
            Manage your priorities and stay productive.
          </motion.p>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex justify-between items-center">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 hidden md:block">
            {/* Future sidebar space, or just some stats */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
              <h3 className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-4">Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-white">{tasks.length}</div>
                  <div className="text-xs text-gray-500">Total Tasks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {tasks.filter(t => t.status === "completed").length}
                  </div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <TaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />
            
            <TaskFilters 
              currentStatus={statusFilter}
              currentPriority={priorityFilter}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
            />

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
            ) : tasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-20 bg-white/5 rounded-xl border border-white/10 border-dashed"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No tasks found</h3>
                <p className="text-gray-400 text-sm">Create a new task to get started.</p>
              </motion.div>
            ) : (
              <motion.div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {tasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
