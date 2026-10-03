'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, BrainstormIdea, DecisionNote, Assignee, Priority, TaskStatus, Category } from '@/types/hunt';
import { INITIAL_TASKS, INITIAL_BRAINSTORM_IDEAS, INITIAL_DECISIONS } from '@/data/initialTasks';

const STORAGE_KEYS = {
  TASKS: 'orbital_hunt_tasks_v1',
  BRAINSTORM: 'orbital_hunt_brainstorm_v1',
  DECISIONS: 'orbital_hunt_decisions_v1',
};

export interface HuntStorageState {
  tasks: Task[];
  brainstormIdeas: BrainstormIdea[];
  decisions: DecisionNote[];
  lastDeletedTask: { task: Task; index: number } | null;
  recentlyChanged: Task[];
  isLoaded: boolean;
}

export function useHuntStorage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [brainstormIdeas, setBrainstormIdeas] = useState<BrainstormIdea[]>([]);
  const [decisions, setDecisions] = useState<DecisionNote[]>([]);
  const [lastDeletedTask, setLastDeletedTask] = useState<{ task: Task; index: number } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; action?: () => void; actionLabel?: string } | null>(null);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, action?: () => void, actionLabel?: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage({ message, action, actionLabel });
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  }, []);

  // Initialize from localStorage or fallback to initial data
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      const storedBrainstorm = localStorage.getItem(STORAGE_KEYS.BRAINSTORM);
      const storedDecisions = localStorage.getItem(STORAGE_KEYS.DECISIONS);

      if (storedTasks) {
        const parsed = JSON.parse(storedTasks) as Task[];
        // normalize order
        const normalized = parsed.map((t, idx) => ({ ...t, order: idx }));
        setTasks(normalized);
      } else {
        setTasks(INITIAL_TASKS.map((t, idx) => ({ ...t, order: idx })));
      }

      if (storedBrainstorm) {
        setBrainstormIdeas(JSON.parse(storedBrainstorm));
      } else {
        setBrainstormIdeas(INITIAL_BRAINSTORM_IDEAS);
      }

      if (storedDecisions) {
        setDecisions(JSON.parse(storedDecisions));
      } else {
        setDecisions(INITIAL_DECISIONS);
      }
    } catch (e) {
      console.error('Failed to parse hunt storage:', e);
      setTasks(INITIAL_TASKS);
      setBrainstormIdeas(INITIAL_BRAINSTORM_IDEAS);
      setDecisions(INITIAL_DECISIONS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to localStorage:', e);
    }
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.BRAINSTORM, JSON.stringify(brainstormIdeas));
    } catch (e) {
      console.error('Error saving brainstorm to localStorage:', e);
    }
  }, [brainstormIdeas, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(decisions));
    } catch (e) {
      console.error('Error saving decisions to localStorage:', e);
    }
  }, [decisions, isLoaded]);

  // Recalculate orders whenever array changes
  const normalizeOrder = (items: Task[]): Task[] => {
    return items.map((t, i) => ({ ...t, order: i }));
  };

  // Add Task
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'order' | 'createdAt' | 'updatedAt'>, insertPosition?: number) => {
    setTasks(prev => {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        order: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      let nextList: Task[];
      if (typeof insertPosition === 'number' && insertPosition >= 0 && insertPosition <= prev.length) {
        nextList = [...prev.slice(0, insertPosition), newTask, ...prev.slice(insertPosition)];
      } else {
        nextList = [...prev, newTask];
      }

      const normalized = normalizeOrder(nextList);
      showToast(`Task "${newTask.title}" added at #${(insertPosition ?? prev.length) + 1}`);
      return normalized;
    });
  }, [showToast]);

  // Update Task
  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'order' | 'createdAt'>>) => {
    setTasks(prev => {
      const idx = prev.findIndex(t => t.id === id);
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        ...updates,
        updatedAt: Date.now(),
      };
      return updated;
    });
  }, []);

  // Delete Task with Undo
  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const idx = prev.findIndex(t => t.id === id);
      if (idx === -1) return prev;
      const target = prev[idx];
      setLastDeletedTask({ task: target, index: idx });

      const nextList = prev.filter(t => t.id !== id);
      const normalized = normalizeOrder(nextList);

      showToast(
        `Deleted #${idx + 1} "${target.title}"`,
        () => {
          // Undo handler
          setTasks(current => {
            const restoredList = [...current.slice(0, idx), target, ...current.slice(idx)];
            return normalizeOrder(restoredList);
          });
          setLastDeletedTask(null);
          showToast(`Restored "${target.title}" to #${idx + 1}`);
        },
        'Undo'
      );

      return normalized;
    });
  }, [showToast]);

  // Undo last delete
  const undoLastDelete = useCallback(() => {
    if (!lastDeletedTask) return;
    const { task, index } = lastDeletedTask;
    setTasks(prev => {
      const restoredList = [...prev.slice(0, index), task, ...prev.slice(index)];
      return normalizeOrder(restoredList);
    });
    setLastDeletedTask(null);
    showToast(`Restored "${task.title}" to #${index + 1}`);
  }, [lastDeletedTask, showToast]);

  // Duplicate Task
  const duplicateTask = useCallback((id: string) => {
    setTasks(prev => {
      const idx = prev.findIndex(t => t.id === id);
      if (idx === -1) return prev;
      const original = prev[idx];
      const duplicated: Task = {
        ...original,
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: `${original.title} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const nextList = [...prev.slice(0, idx + 1), duplicated, ...prev.slice(idx + 1)];
      const normalized = normalizeOrder(nextList);
      showToast(`Duplicated into #${idx + 2}: "${duplicated.title}"`);
      return normalized;
    });
  }, [showToast]);

  // Reorder Tasks (vertically drag and drop)
  const reorderTasks = useCallback((sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex === destinationIndex) return;
    setTasks(prev => {
      if (sourceIndex < 0 || sourceIndex >= prev.length || destinationIndex < 0 || destinationIndex >= prev.length) {
        return prev;
      }
      const list = [...prev];
      const [removed] = list.splice(sourceIndex, 1);
      list.splice(destinationIndex, 0, removed);
      return normalizeOrder(list);
    });
  }, []);

  // Move task up or down by 1 position (useful for buttons/touch/tablet)
  const moveTask = useCallback((index: number, direction: 'up' | 'down') => {
    setTasks(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const list = [...prev];
      const [removed] = list.splice(index, 1);
      list.splice(targetIndex, 0, removed);
      return normalizeOrder(list);
    });
  }, []);

  // Reset to initial tasks
  const resetToInitial = useCallback(() => {
    const freshTasks = normalizeOrder(INITIAL_TASKS);
    setTasks(freshTasks);
    setBrainstormIdeas(INITIAL_BRAINSTORM_IDEAS);
    setDecisions(INITIAL_DECISIONS);
    setLastDeletedTask(null);
    showToast('Reset board to initial 52 ORBITAL hunt tasks');
  }, [showToast]);

  // Export JSON
  const exportBoardJson = useCallback(() => {
    const data = {
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      tasks,
      brainstormIdeas,
      decisions,
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orbital-hunt-board-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Board data exported successfully');
  }, [tasks, brainstormIdeas, decisions, showToast]);

  // Import JSON
  const importBoardJson = useCallback((jsonString: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
        return { success: false, error: 'Invalid JSON: "tasks" array missing' };
      }
      const importedTasks: Task[] = parsed.tasks.map((t: any, idx: number) => ({
        id: t.id || `task-${Date.now()}-${idx}`,
        order: idx,
        title: String(t.title || 'Untitled Task'),
        assignees: (t.assignees || 'Unassigned') as Assignee,
        status: (t.status || 'Not Started') as TaskStatus,
        priority: (t.priority || 'Normal') as Priority,
        category: (t.category || 'Other') as Category,
        notes: String(t.notes || ''),
        dependency: t.dependency ? String(t.dependency) : undefined,
        createdAt: Number(t.createdAt) || Date.now(),
        updatedAt: Number(t.updatedAt) || Date.now(),
      }));

      setTasks(importedTasks);

      if (Array.isArray(parsed.brainstormIdeas)) {
        setBrainstormIdeas(parsed.brainstormIdeas);
      }
      if (Array.isArray(parsed.decisions)) {
        setDecisions(parsed.decisions);
      }

      showToast(`Imported ${importedTasks.length} tasks successfully`);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to parse JSON file' };
    }
  }, [showToast]);

  // Brainstorm CRUD
  const addBrainstormIdea = useCallback((idea: string, notes: string, suggestedBy: any) => {
    const newIdea: BrainstormIdea = {
      id: `idea-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      idea,
      notes,
      suggestedBy,
      createdAt: Date.now(),
    };
    setBrainstormIdeas(prev => [newIdea, ...prev]);
    showToast(`Added brainstorm idea: "${idea.slice(0, 30)}..."`);
  }, [showToast]);

  const deleteBrainstormIdea = useCallback((id: string) => {
    setBrainstormIdeas(prev => prev.filter(item => item.id !== id));
    showToast('Deleted brainstorm idea');
  }, [showToast]);

  const convertBrainstormToTask = useCallback((ideaId: string, overrides?: Partial<Omit<Task, 'id' | 'order' | 'createdAt' | 'updatedAt'>>) => {
    const item = brainstormIdeas.find(b => b.id === ideaId);
    if (!item) return;

    const assignee = (item.suggestedBy === 'All' ? 'You + Ruhaan + Daksh' : item.suggestedBy) as Assignee;

    addTask({
      title: item.idea,
      notes: item.notes,
      assignees: overrides?.assignees || assignee,
      status: overrides?.status || 'Discussing',
      priority: overrides?.priority || 'Normal',
      category: overrides?.category || 'Puzzle',
      dependency: overrides?.dependency,
    });

    // Remove from brainstorm
    deleteBrainstormIdea(ideaId);
    showToast(`Converted idea to official task!`);
  }, [brainstormIdeas, addTask, deleteBrainstormIdea, showToast]);

  // Decision CRUD
  const addDecision = useCallback((topic: string, decision: string, status: DecisionNote['status'] = 'Open') => {
    const newDec: DecisionNote = {
      id: `dec-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      topic,
      decision,
      status,
      updatedAt: Date.now(),
    };
    setDecisions(prev => [newDec, ...prev]);
    showToast(`Added decision note on "${topic.slice(0, 25)}..."`);
  }, [showToast]);

  const updateDecision = useCallback((id: string, updates: Partial<Omit<DecisionNote, 'id'>>) => {
    setDecisions(prev =>
      prev.map(d => (d.id === id ? { ...d, ...updates, updatedAt: Date.now() } : d))
    );
  }, []);

  const deleteDecision = useCallback((id: string) => {
    setDecisions(prev => prev.filter(d => d.id !== id));
    showToast('Deleted decision note');
  }, [showToast]);

  // Derived: Recently changed tasks (last 5 sorted by updatedAt desc)
  const recentlyChanged = [...tasks]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);

  return {
    tasks,
    isLoaded,
    brainstormIdeas,
    decisions,
    lastDeletedTask,
    recentlyChanged,
    toastMessage,
    addTask,
    updateTask,
    deleteTask,
    undoLastDelete,
    duplicateTask,
    reorderTasks,
    moveTask,
    resetToInitial,
    exportBoardJson,
    importBoardJson,
    addBrainstormIdea,
    deleteBrainstormIdea,
    convertBrainstormToTask,
    addDecision,
    updateDecision,
    deleteDecision,
    dismissToast: () => setToastMessage(null),
  };
}
