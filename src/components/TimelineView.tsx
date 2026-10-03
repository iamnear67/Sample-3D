'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types/hunt';
import { CheckCircle2, Clock, AlertOctagon, User, ArrowRight, ExternalLink } from 'lucide-react';

interface TimelineViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export function TimelineView({ tasks, onSelectTask }: TimelineViewProps) {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Done':
        return 'border-emerald-500 bg-emerald-950/40 text-emerald-400';
      case 'In Progress':
        return 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-[0_0_10px_rgba(0,242,254,0.2)]';
      case 'Blocked':
        return 'border-rose-500 bg-rose-950/40 text-rose-300';
      case 'Discussing':
        return 'border-purple-500 bg-purple-950/40 text-purple-300';
      case 'Not Started':
      default:
        return 'border-slate-800 bg-slate-900/60 text-slate-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold font-mono tracking-wider text-slate-100 uppercase flex items-center gap-2">
              <span>HUNT EXECUTION PIPELINE // CHRONOLOGICAL SEQUENCE (1–{tasks.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any node to view full details or modify properties.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Done
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> In Progress
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2 h-2 rounded-full bg-purple-400" /> Discussing
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-600" /> Not Started
            </span>
          </div>
        </div>

        {/* Grid of timeline nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {tasks.map((task, index) => {
            const serial = index + 1;
            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className={`group cursor-pointer rounded-lg p-3 border transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between ${getStatusColor(
                  task.status
                )}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-mono text-xs font-extrabold px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-700/60">
                      #{serial}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-950/60">
                      {task.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {task.title}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-300 truncate max-w-[120px]">{task.assignees}</span>
                  <span className="text-[10px] font-bold uppercase">{task.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
