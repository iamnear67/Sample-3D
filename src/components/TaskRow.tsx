'use client';

import React, { useState } from 'react';
import { Task, Assignee, Priority, TaskStatus, Category } from '@/types/hunt';
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertOctagon,
  User,
  Layers,
  Save,
  X,
} from 'lucide-react';

interface TaskRowProps {
  task: Task;
  serialNumber: number;
  isFirst: boolean;
  isLast: boolean;
  canDrag: boolean;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export function TaskRow({
  task,
  serialNumber,
  isFirst,
  isLast,
  canDrag,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onEdit,
  onDelete,
  onDuplicate,
  onMove,
  onUpdateNotes,
}: TaskRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(task.notes);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Done':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-950/70 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Done
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 animate-pulse-subtle">
            <Clock className="w-3 h-3 text-cyan-400" /> In Progress
          </span>
        );
      case 'Blocked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-rose-950/80 text-rose-300 border border-rose-500/50">
            <AlertOctagon className="w-3 h-3 text-rose-400" /> Blocked
          </span>
        );
      case 'Discussing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-purple-950/70 text-purple-300 border border-purple-500/40">
            <Clock className="w-3 h-3 text-purple-400" /> Discussing
          </span>
        );
      case 'Not Started':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-900 text-slate-400 border border-slate-800">
            Not Started
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            High
          </span>
        );
      case 'Normal':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-blue-500/10 text-blue-300 border border-blue-500/30">
            Normal
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700/60">
            Low
          </span>
        );
    }
  };

  const getAssigneeChips = (assignees: Assignee) => {
    if (assignees === 'Unassigned') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900/90 text-slate-500 border border-dashed border-slate-700">
          Unassigned
        </span>
      );
    }

    const members = assignees.split('+').map(s => s.trim());
    return (
      <div className="flex flex-wrap gap-1 items-center">
        {members.map((m, idx) => {
          let style = 'bg-slate-800 text-slate-300 border-slate-700';
          if (m === 'You') {
            style = 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40 font-semibold';
          } else if (m === 'Ruhaan') {
            style = 'bg-purple-950/70 text-purple-300 border-purple-500/40 font-semibold';
          } else if (m === 'Daksh') {
            style = 'bg-amber-950/70 text-amber-300 border-amber-500/40 font-semibold';
          }
          return (
            <span
              key={idx}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${style}`}
            >
              <User className="w-2.5 h-2.5 opacity-70" />
              {m}
            </span>
          );
        })}
      </div>
    );
  };

  const getCategoryBadge = (category: Category) => {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide bg-slate-900/90 text-slate-300 border border-slate-800">
        {category}
      </span>
    );
  };

  const handleSaveNotes = () => {
    onUpdateNotes(task.id, notesDraft);
    setIsEditingNotes(false);
  };

  return (
    <div
      draggable={canDrag}
      onDragStart={e => onDragStart(e, serialNumber - 1)}
      onDragOver={e => onDragOver(e, serialNumber - 1)}
      onDragEnd={onDragEnd}
      onDrop={e => onDrop(e, serialNumber - 1)}
      className={`group transition-all border-b border-slate-800/80 ${
        task.status === 'Done'
          ? 'bg-slate-950/40 hover:bg-slate-900/40 opacity-80'
          : 'bg-slate-900/50 hover:bg-slate-900/90'
      } ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {/* Main Row */}
      <div className="grid grid-cols-12 items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 text-xs">
        {/* Drag Handle & Serial Number (1 col) */}
        <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5">
          <div
            className={`p-1 rounded text-slate-600 transition-colors ${
              canDrag ? 'hover:text-cyan-400 group-hover:text-slate-400' : 'opacity-30'
            }`}
            title={canDrag ? 'Drag to reorder task sequence' : 'Clear filters to reorder'}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono font-bold text-slate-300 text-xs w-6 text-center">
            {serialNumber}
          </span>
        </div>

        {/* Task Title & Dependency (4 cols) */}
        <div className="col-span-10 sm:col-span-4 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <span
              onClick={() => onEdit(task)}
              className={`font-medium tracking-wide truncate cursor-pointer hover:text-cyan-300 transition-colors ${
                task.status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-100 font-semibold'
              }`}
              title={task.title}
            >
              {task.title}
            </span>
            {task.dependency && (
              <span className="hidden md:inline-flex px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-slate-400 border border-slate-700/60 shrink-0">
                dep: {task.dependency}
              </span>
            )}
          </div>
        </div>

        {/* Assignee (2 cols) */}
        <div className="col-span-6 sm:col-span-2 hidden sm:block">
          {getAssigneeChips(task.assignees)}
        </div>

        {/* Status (2 cols) */}
        <div className="col-span-4 sm:col-span-2 hidden sm:block">
          {getStatusBadge(task.status)}
        </div>

        {/* Priority & Category (1 col) */}
        <div className="col-span-1 hidden lg:flex flex-col gap-1 items-start">
          {getPriorityBadge(task.priority)}
          {getCategoryBadge(task.category)}
        </div>

        {/* Notes Toggle & Actions (2 cols) */}
        <div className="col-span-12 sm:col-span-2 flex items-center justify-end gap-1.5 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800/40">
          {/* Notes Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-colors ${
              task.notes
                ? isExpanded
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-300 hover:text-cyan-300'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Expand / collapse notes"
          >
            <FileText className="w-3 h-3" />
            <span className="hidden xl:inline">{task.notes ? 'Notes' : 'Add Note'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Nudge Buttons */}
          <div className="hidden xl:flex items-center bg-slate-950/70 border border-slate-800 rounded">
            <button
              onClick={() => onMove(serialNumber - 1, 'up')}
              disabled={isFirst}
              className="p-1 text-slate-400 hover:text-cyan-400 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
              title="Move Up"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => onMove(serialNumber - 1, 'down')}
              disabled={isLast}
              className="p-1 text-slate-400 hover:text-cyan-400 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
              title="Move Down"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Edit */}
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Duplicate */}
          <button
            onClick={() => onDuplicate(task.id)}
            className="p-1 text-slate-400 hover:text-purple-300 hover:bg-slate-800 rounded transition-colors"
            title="Duplicate Task"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button / Confirmation */}
          {showDeleteConfirm ? (
            <div className="flex items-center gap-1 bg-rose-950/90 border border-rose-500/50 rounded px-1 py-0.5">
              <button
                onClick={() => {
                  onDelete(task.id);
                  setShowDeleteConfirm(false);
                }}
                className="text-[10px] font-mono font-bold text-rose-300 hover:text-rose-100 uppercase"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-slate-400 hover:text-slate-200 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Notes Section (shows directly underneath task row) */}
      {isExpanded && (
        <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800/80 text-xs font-mono animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> Brainstorming & Architecture Notes
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              {isEditingNotes ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSaveNotes}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400"
                  >
                    <Save className="w-3 h-3" /> Save Note
                  </button>
                  <button
                    onClick={() => {
                      setNotesDraft(task.notes);
                      setIsEditingNotes(false);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setNotesDraft(task.notes);
                    setIsEditingNotes(true);
                  }}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline"
                >
                  <Edit2 className="w-2.5 h-2.5" /> Edit Note
                </button>
              )}
            </div>
          </div>

          {isEditingNotes ? (
            <textarea
              rows={3}
              value={notesDraft}
              onChange={e => setNotesDraft(e.target.value)}
              className="w-full bg-slate-900 border border-cyan-500/50 rounded p-2 text-slate-200 text-xs focus:outline-none font-mono"
              placeholder="Enter brainstorming or implementation notes..."
            />
          ) : (
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed text-xs">
              {task.notes || (
                <span className="italic text-slate-500">No notes written yet. Click edit to add notes.</span>
              )}
            </div>
          )}

          <div className="mt-2.5 flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-900">
            <div>
              <span className="text-slate-400">Category:</span> {task.category} &bull;{' '}
              <span className="text-slate-400">Priority:</span> {task.priority}
            </div>
            <div>
              Last updated: {new Date(task.updatedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
