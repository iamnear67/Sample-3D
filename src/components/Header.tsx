'use client';

import React, { useRef } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  RotateCcw,
  Lightbulb,
  FileQuestion,
  Map,
  Eye,
  EyeOff,
  GitBranch,
  Terminal,
  Activity,
  X,
} from 'lucide-react';
import { Assignee, Priority, TaskStatus, Category, FilterAssignee, FilterStatus, FilterPriority, FilterCategory } from '@/types/hunt';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  assigneeFilter: FilterAssignee;
  onAssigneeFilterChange: (a: FilterAssignee) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (s: FilterStatus) => void;
  priorityFilter: FilterPriority;
  onPriorityFilterChange: (p: FilterPriority) => void;
  categoryFilter: FilterCategory;
  onCategoryFilterChange: (c: FilterCategory) => void;
  quickMember: 'All' | 'You' | 'Ruhaan' | 'Daksh';
  onQuickMemberChange: (m: 'All' | 'You' | 'Ruhaan' | 'Daksh') => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  viewMode: 'table' | 'timeline';
  onToggleViewMode: () => void;
  showArchitecture: boolean;
  onToggleArchitecture: () => void;
  onOpenAddModal: () => void;
  onOpenBrainstorm: () => void;
  onOpenDecisions: () => void;
  onExport: () => void;
  onImport: (jsonStr: string) => void;
  onReset: () => void;
  brainstormCount: number;
  openDecisionsCount: number;
  totalTasks: number;
}

export function Header({
  searchQuery,
  onSearchChange,
  assigneeFilter,
  onAssigneeFilterChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  quickMember,
  onQuickMemberChange,
  isFocusMode,
  onToggleFocusMode,
  viewMode,
  onToggleViewMode,
  showArchitecture,
  onToggleArchitecture,
  onOpenAddModal,
  onOpenBrainstorm,
  onOpenDecisions,
  onExport,
  onImport,
  onReset,
  brainstormCount,
  openDecisionsCount,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showFiltersModal, setShowFiltersModal] = React.useState(false);

  const activeFiltersCount =
    (assigneeFilter !== 'All' ? 1 : 0) +
    (statusFilter !== 'All' ? 1 : 0) +
    (priorityFilter !== 'All' ? 1 : 0) +
    (categoryFilter !== 'All' ? 1 : 0);

  const clearAllFilters = () => {
    onAssigneeFilterChange('All');
    onStatusFilterChange('All');
    onPriorityFilterChange('All');
    onCategoryFilterChange('All');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        onImport(content);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <header className="border-b border-cyan-900/40 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-all">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.15)]">
            <Terminal className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs tracking-widest text-cyan-400 font-bold uppercase">
                ORBITAL CO.
              </span>
              <span className="text-slate-600">/</span>
              <h1 className="text-sm sm:text-base font-extrabold tracking-wider text-slate-100 uppercase">
                AI SCAVENGER HUNT <span className="text-cyan-400">// BUILD BOARD</span>
              </h1>
              {/* Online indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SYSTEM: ONLINE</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 tracking-wide mt-0.5 font-light">
              "Plan the hunt. Break the system. Don't let ORBIT do all the work."
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Timeline / Table Switch */}
          <button
            onClick={onToggleViewMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono border transition-all ${
              viewMode === 'timeline'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(0,242,254,0.15)]'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:border-slate-500'
            }`}
            title="Toggle between list and sequence timeline view"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{viewMode === 'timeline' ? 'Table View' : 'Timeline View'}</span>
          </button>

          {/* Focus Mode */}
          <button
            onClick={onToggleFocusMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono border transition-all ${
              isFocusMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:border-slate-500'
            }`}
            title="Focus Mode hides completed tasks to reduce clutter"
          >
            {isFocusMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isFocusMode ? 'Focus: ON' : 'Focus Mode'}</span>
          </button>

          {/* Hunt Architecture toggle */}
          <button
            onClick={onToggleArchitecture}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono border transition-all ${
              showArchitecture
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:border-slate-500'
            }`}
            title="Toggle Hunt Architecture & Final ORB Mechanics Reference"
          >
            <Map className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Hunt Architecture</span>
          </button>

          {/* Brainstorm Hub */}
          <button
            onClick={onOpenBrainstorm}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono bg-slate-900/80 text-yellow-300 border border-yellow-500/40 hover:bg-yellow-950/40 hover:border-yellow-400 transition-all"
            title="Brainstorm Mode: unassigned ideas not part of official task sequence"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Brainstorm</span>
            {brainstormCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-yellow-500/20 text-[10px] font-bold border border-yellow-500/30">
                {brainstormCount}
              </span>
            )}
          </button>

          {/* Decisions */}
          <button
            onClick={onOpenDecisions}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono bg-slate-900/80 text-purple-300 border border-purple-500/40 hover:bg-purple-950/40 hover:border-purple-400 transition-all"
            title="Decisions & Open Questions log"
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Decisions</span>
            {openDecisionsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-[10px] font-bold border border-purple-500/30">
                {openDecisionsCount}
              </span>
            )}
          </button>

          {/* Data Export / Import / Reset */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded p-0.5">
            <button
              onClick={onExport}
              className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
              title="Export Board JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
              title="Import Board JSON"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
              title="Reset to Initial 52 Tasks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Task Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs tracking-wider uppercase rounded shadow-[0_0_15px_rgba(0,242,254,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Create a new task [Shortcut: N]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Task</span>
            <kbd className="hidden sm:inline px-1 py-0.2 text-[9px] bg-cyan-900/50 text-cyan-200 rounded font-mono">
              N
            </kbd>
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Quick Member Filters, Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-900/60 bg-slate-950/40">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by title, notes, category, or assignee... [/]"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-900/90 border border-slate-800 focus:border-cyan-500/70 focus:outline-none rounded text-slate-200 placeholder-slate-500 font-mono transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Quick "My Tasks" Filters */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase mr-1 hidden lg:inline">
            Quick Filter:
          </span>
          {(['All', 'You', 'Ruhaan', 'Daksh'] as const).map(member => (
            <button
              key={member}
              onClick={() => onQuickMemberChange(member)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                quickMember === member
                  ? member === 'You'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 font-semibold'
                    : member === 'Ruhaan'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/60 font-semibold'
                    : member === 'Daksh'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 font-semibold'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 font-semibold'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {member}
            </button>
          ))}
        </div>

        {/* Advanced Filters Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFiltersModal(!showFiltersModal)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-all ${
              activeFiltersCount > 0
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 underline underline-offset-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters Drawer */}
      {showFiltersModal && (
        <div className="bg-slate-900/95 border-b border-cyan-900/40 px-4 sm:px-6 lg:px-8 py-3 transition-all animate-in fade-in duration-150">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* Assignee Filter */}
            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                Assignee
              </label>
              <select
                value={assigneeFilter}
                onChange={e => onAssigneeFilterChange(e.target.value as FilterAssignee)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
              >
                <option value="All">All Assignees</option>
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

            {/* Status Filter */}
            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={e => onStatusFilterChange(e.target.value as FilterStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
              >
                <option value="All">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="Discussing">Discussing</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={e => onPriorityFilterChange(e.target.value as FilterPriority)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={e => onCategoryFilterChange(e.target.value as FilterCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
              >
                <option value="All">All Categories</option>
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
        </div>
      )}
    </header>
  );
}
