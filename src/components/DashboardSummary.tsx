'use client';

import React from 'react';
import { Task } from '@/types/hunt';
import { CheckCircle2, Clock, AlertOctagon, UserX, BarChart3, User, ShieldAlert } from 'lucide-react';

interface DashboardSummaryProps {
  tasks: Task[];
}

export function DashboardSummary({ tasks }: DashboardSummaryProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Done').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const blocked = tasks.filter(t => t.status === 'Blocked').length;
  const discussing = tasks.filter(t => t.status === 'Discussing').length;
  const unassigned = tasks.filter(t => t.assignees === 'Unassigned').length;

  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Workload summary (multi-person counts for each person)
  const youTasks = tasks.filter(t => t.assignees.includes('You')).length;
  const ruhaanTasks = tasks.filter(t => t.assignees.includes('Ruhaan')).length;
  const dakshTasks = tasks.filter(t => t.assignees.includes('Daksh')).length;

  const totalAssignedWorkload = youTasks + ruhaanTasks + dakshTasks;
  const youPercent = totalAssignedWorkload > 0 ? Math.round((youTasks / totalAssignedWorkload) * 100) : 0;
  const ruhaanPercent = totalAssignedWorkload > 0 ? Math.round((ruhaanTasks / totalAssignedWorkload) * 100) : 0;
  const dakshPercent = totalAssignedWorkload > 0 ? Math.round((dakshTasks / totalAssignedWorkload) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Core Progress Card */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs text-slate-300 font-semibold uppercase tracking-wider">
                Mission Execution Metrics
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Hunt Completion:</span>
              <span className="font-bold text-cyan-400 text-sm">{progressPercent}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800 mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(0,242,254,0.4)]"
              style={{ width: `${Math.max(progressPercent, 2)}%` }}
            />
          </div>

          {/* Status Metrics Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
            {/* Total */}
            <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-2.5 hover:border-slate-700 transition-colors">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">Total</div>
              <div className="text-lg font-bold font-mono text-slate-100">{total}</div>
            </div>

            {/* In Progress */}
            <div className="bg-slate-950/60 border border-cyan-900/30 rounded-lg p-2.5 hover:border-cyan-700/50 transition-colors">
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                <Clock className="w-2.5 h-2.5" /> In Progress
              </div>
              <div className="text-lg font-bold font-mono text-cyan-300">{inProgress}</div>
            </div>

            {/* Completed */}
            <div className="bg-slate-950/60 border border-emerald-900/30 rounded-lg p-2.5 hover:border-emerald-700/50 transition-colors">
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Done
              </div>
              <div className="text-lg font-bold font-mono text-emerald-300">{completed}</div>
            </div>

            {/* Blocked */}
            <div className="bg-slate-950/60 border border-rose-900/30 rounded-lg p-2.5 hover:border-rose-700/50 transition-colors">
              <div className="text-[10px] font-mono text-rose-400 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                <AlertOctagon className="w-2.5 h-2.5" /> Blocked
              </div>
              <div className="text-lg font-bold font-mono text-rose-300">{blocked}</div>
            </div>

            {/* Unassigned */}
            <div className="bg-slate-950/60 border border-amber-900/30 rounded-lg p-2.5 hover:border-amber-700/50 transition-colors col-span-2 sm:col-span-1">
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                <UserX className="w-2.5 h-2.5" /> Unassigned
              </div>
              <div className="text-lg font-bold font-mono text-amber-300">{unassigned}</div>
            </div>
          </div>
        </div>

        {/* Workload Distribution Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-xs text-slate-300 font-semibold uppercase tracking-wider">
                  Division of Labor
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                (multi-person credited)
              </span>
            </div>

            {/* Team Members Workload Breakdown */}
            <div className="space-y-2.5 font-mono text-xs">
              {/* You */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> You
                  </span>
                  <span className="font-bold">{youTasks} tasks <span className="text-slate-500">({youPercent}%)</span></span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/60">
                  <div className="h-full bg-cyan-400 rounded-full transition-all duration-300" style={{ width: `${youPercent}%` }} />
                </div>
              </div>

              {/* Ruhaan */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-purple-400">
                    <span className="w-2 h-2 rounded-full bg-purple-400" /> Ruhaan
                  </span>
                  <span className="font-bold">{ruhaanTasks} tasks <span className="text-slate-500">({ruhaanPercent}%)</span></span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/60">
                  <div className="h-full bg-purple-400 rounded-full transition-all duration-300" style={{ width: `${ruhaanPercent}%` }} />
                </div>
              </div>

              {/* Daksh */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Daksh
                  </span>
                  <span className="font-bold">{dakshTasks} tasks <span className="text-slate-500">({dakshPercent}%)</span></span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/60">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-300" style={{ width: `${dakshPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Collaborative Triad:</span>
            <span className="text-slate-300">You, Ruhaan, Daksh</span>
          </div>
        </div>
      </div>
    </div>
  );
}
