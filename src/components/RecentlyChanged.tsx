'use client';

import React from 'react';
import { Task } from '@/types/hunt';
import { History, Clock, ArrowRight } from 'lucide-react';

interface RecentlyChangedProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export function RecentlyChanged({ tasks, onSelectTask }: RecentlyChangedProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-3 text-xs font-mono">
        <div className="flex items-center gap-2 mb-2 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
          <History className="w-3.5 h-3.5 text-cyan-400" />
          <span>Recently Updated Objectives</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tasks.map(t => (
            <button
              key={t.id}
              onClick={() => onSelectTask(t)}
              className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 text-slate-300 transition-colors text-left"
            >
              <span className="text-cyan-400 font-bold">#{t.order + 1}</span>
              <span className="truncate max-w-[200px] text-xs">{t.title}</span>
              <span className="text-[10px] text-slate-500">
                {new Date(t.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
