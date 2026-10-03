'use client';

import React, { useState, useEffect } from 'react';
import { Task, Assignee, Priority, TaskStatus, Category } from '@/types/hunt';
import { X, Check, Plus, Edit2, AlertCircle } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  totalTasks: number;
  onSave: (
    data: Omit<Task, 'id' | 'order' | 'createdAt' | 'updatedAt'>,
    insertPosition?: number
  ) => void;
  onUpdate: (id: string, updates: Partial<Omit<Task, 'id' | 'order' | 'createdAt'>>) => void;
}

export function TaskModal({
  isOpen,
  onClose,
  taskToEdit,
  totalTasks,
  onSave,
  onUpdate,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [assignees, setAssignees] = useState<Assignee>('You');
  const [status, setStatus] = useState<TaskStatus>('Not Started');
  const [priority, setPriority] = useState<Priority>('Normal');
  const [category, setCategory] = useState<Category>('Puzzle');
  const [notes, setNotes] = useState('');
  const [dependency, setDependency] = useState('');
  const [insertOption, setInsertOption] = useState<'end' | 'start' | 'custom'>('end');
  const [customInsertPos, setCustomInsertPos] = useState<number>(totalTasks);
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setAssignees(taskToEdit.assignees);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setNotes(taskToEdit.notes);
      setDependency(taskToEdit.dependency || '');
    } else {
      setTitle('');
      setAssignees('You');
      setStatus('Not Started');
      setPriority('Normal');
      setCategory('Puzzle');
      setNotes('');
      setDependency('');
      setInsertOption('end');
      setCustomInsertPos(totalTasks);
    }
    setError('');
  }, [taskToEdit, totalTasks, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task name is required.');
      return;
    }

    if (taskToEdit) {
      onUpdate(taskToEdit.id, {
        title: title.trim(),
        assignees,
        status,
        priority,
        category,
        notes: notes.trim(),
        dependency: dependency.trim() || undefined,
      });
    } else {
      let insertPos: number | undefined = undefined;
      if (insertOption === 'start') {
        insertPos = 0;
      } else if (insertOption === 'custom') {
        insertPos = Math.max(0, Math.min(totalTasks, customInsertPos));
      }
      onSave(
        {
          title: title.trim(),
          assignees,
          status,
          priority,
          category,
          notes: notes.trim(),
          dependency: dependency.trim() || undefined,
        },
        insertPos
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            {taskToEdit ? (
              <Edit2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <Plus className="w-4 h-4 text-cyan-400" />
            )}
            <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              {taskToEdit ? `Edit Task #${taskToEdit.order + 1}` : 'New Hunt Objective'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Task Name */}
          <div>
            <label className="block text-slate-400 uppercase text-[10px] tracking-wider mb-1">
              Task Name / Objective <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Whiteboard projector clue extraction"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded px-3 py-2 text-slate-100 text-xs focus:outline-none"
            />
          </div>

          {/* Assignee & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                Assignee
              </label>
              <select
                value={assignees}
                onChange={e => setAssignees(e.target.value as Assignee)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none"
              >
                <option value="You">You</option>
                <option value="Ruhaan">Ruhaan</option>
                <option value="Daksh">Daksh</option>
                <option value="You + Ruhaan">You + Ruhaan</option>
                <option value="You + Daksh">You + Daksh</option>
                <option value="Ruhaan + Daksh">Ruhaan + Daksh</option>
                <option value="You + Ruhaan + Daksh">You + Ruhaan + Daksh</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none"
              >
                <option value="Not Started">Not Started</option>
                <option value="Discussing">Discussing</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none"
              >
                <option value="Website">Website</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Story">Story</option>
                <option value="ORBIT">ORBIT</option>
                <option value="ORB">ORB</option>
                <option value="Technical">Technical</option>
                <option value="Authentication">Authentication</option>
                <option value="Testing">Testing</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Content">Content</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Optional Dependency */}
          <div>
            <label className="block text-slate-400 uppercase text-[10px] tracking-wider mb-1">
              Optional Dependency
            </label>
            <input
              type="text"
              value={dependency}
              onChange={e => setDependency(e.target.value)}
              placeholder="e.g. task-1, Tier-4 Login, or Whiteboard"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none"
            />
          </div>

          {/* Insert Position (Only in Add Mode) */}
          {!taskToEdit && (
            <div>
              <label className="block text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                Insert Position in Hunt Sequence
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setInsertOption('end')}
                  className={`py-1.5 px-2 rounded border text-[11px] transition-colors ${
                    insertOption === 'end'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  At End (#{totalTasks + 1})
                </button>
                <button
                  type="button"
                  onClick={() => setInsertOption('start')}
                  className={`py-1.5 px-2 rounded border text-[11px] transition-colors ${
                    insertOption === 'start'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  At Top (#1)
                </button>
                <button
                  type="button"
                  onClick={() => setInsertOption('custom')}
                  className={`py-1.5 px-2 rounded border text-[11px] transition-colors ${
                    insertOption === 'custom'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Custom Position
                </button>
              </div>

              {insertOption === 'custom' && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Insert as Serial #</span>
                  <input
                    type="number"
                    min={1}
                    max={totalTasks + 1}
                    value={customInsertPos + 1}
                    onChange={e => setCustomInsertPos(Math.max(0, parseInt(e.target.value) - 1 || 0))}
                    className="w-20 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none"
                  />
                  <span className="text-slate-500 text-[10px]">(All subsequent tasks renumber automatically)</span>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-slate-400 uppercase text-[10px] tracking-wider mb-1">
              Brainstorming / Technical Notes
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add specs, puzzle solutions, or lore references..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none font-mono"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors uppercase tracking-wider text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold uppercase tracking-wider text-xs transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              {taskToEdit ? 'Save Changes' : 'Add to Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
