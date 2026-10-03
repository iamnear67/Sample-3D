'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useHuntStorage } from '@/hooks/useHuntStorage';
import {
  Task,
  FilterAssignee,
  FilterStatus,
  FilterPriority,
  FilterCategory,
  SortOption,
  TeamMember,
} from '@/types/hunt';
import { Header } from '@/components/Header';
import { DashboardSummary } from '@/components/DashboardSummary';
import { HuntArchitecture } from '@/components/HuntArchitecture';
import { TaskRow } from '@/components/TaskRow';
import { TaskModal } from '@/components/TaskModal';
import { TimelineView } from '@/components/TimelineView';
import { BrainstormModal } from '@/components/BrainstormModal';
import { DecisionsModal } from '@/components/DecisionsModal';
import { ResetConfirmModal } from '@/components/ResetConfirmModal';
import { RecentlyChanged } from '@/components/RecentlyChanged';
import { Toast } from '@/components/Toast';
import {
  ArrowUpDown,
  Filter,
  Layers,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';

export default function HuntBoardPage() {
  const {
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
    dismissToast,
  } = useHuntStorage();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState<FilterAssignee>('All');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('All');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('All');
  const [quickMember, setQuickMember] = useState<'All' | 'You' | 'Ruhaan' | 'Daksh'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('manual');

  // UI View States
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [showArchitecture, setShowArchitecture] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isBrainstormOpen, setIsBrainstormOpen] = useState(false);
  const [isDecisionsOpen, setIsDecisionsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Quick Member Filter helper
  const handleQuickMemberChange = (member: 'All' | 'You' | 'Ruhaan' | 'Daksh') => {
    setQuickMember(member);
    if (member === 'All') {
      setAssigneeFilter('All');
    } else {
      setAssigneeFilter(member);
    }
  };

  // Keyboard shortcuts handler:
  // N: new task modal
  // /: focus search
  // Ctrl+Z: undo last delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'SELECT';

      // N for New Task
      if (e.key.toLowerCase() === 'n' && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setEditingTask(null);
        setIsAddModalOpen(true);
      }

      // / for search
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }

      // Ctrl/Cmd + Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (!isInput && lastDeletedTask) {
          e.preventDefault();
          undoLastDelete();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastDeletedTask, undoLastDelete]);

  // Priority weight map for sorting
  const priorityWeights: Record<string, number> = {
    Critical: 4,
    High: 3,
    Normal: 2,
    Low: 1,
  };

  // Status weight map for sorting
  const statusWeights: Record<string, number> = {
    Blocked: 5,
    'In Progress': 4,
    Discussing: 3,
    'Not Started': 2,
    Done: 1,
  };

  // Filtered and Sorted Tasks
  const displayedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Focus Mode: hides completed tasks
        if (isFocusMode && task.status === 'Done') {
          return false;
        }

        // Quick Member or Assignee Filter
        if (assigneeFilter !== 'All') {
          if (!task.assignees.includes(assigneeFilter)) return false;
        }

        // Status Filter
        if (statusFilter !== 'All' && task.status !== statusFilter) {
          return false;
        }

        // Priority Filter
        if (priorityFilter !== 'All' && task.priority !== priorityFilter) {
          return false;
        }

        // Category Filter
        if (categoryFilter !== 'All' && task.category !== categoryFilter) {
          return false;
        }

        // Search Query (title, notes, category, assignee)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesNotes = task.notes.toLowerCase().includes(q);
          const matchesCategory = task.category.toLowerCase().includes(q);
          const matchesAssignees = task.assignees.toLowerCase().includes(q);
          if (!matchesTitle && !matchesNotes && !matchesCategory && !matchesAssignees) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
        }
        if (sortBy === 'status') {
          return (statusWeights[b.status] || 0) - (statusWeights[a.status] || 0);
        }
        if (sortBy === 'assignee') {
          return a.assignees.localeCompare(b.assignees);
        }
        if (sortBy === 'category') {
          return a.category.localeCompare(b.category);
        }
        // Manual order (canonical order)
        return a.order - b.order;
      });
  }, [
    tasks,
    isFocusMode,
    assigneeFilter,
    statusFilter,
    priorityFilter,
    categoryFilter,
    searchQuery,
    sortBy,
  ]);

  // Drag and drop handlers
  const canDrag =
    sortBy === 'manual' &&
    !searchQuery &&
    assigneeFilter === 'All' &&
    statusFilter === 'All' &&
    priorityFilter === 'All' &&
    categoryFilter === 'All' &&
    !isFocusMode;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!canDrag) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!canDrag) return;
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    if (!canDrag || draggedIndex === null) return;
    e.preventDefault();
    reorderTasks(draggedIndex, targetIndex);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setAssigneeFilter('All');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setQuickMember('All');
    setSortBy('manual');
    setIsFocusMode(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090e] text-cyan-400 font-mono text-sm gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <span className="tracking-widest uppercase">INITIALIZING ORBITAL SYSTEMS...</span>
      </div>
    );
  }

  const openDecisionsCount = decisions.filter(d => d.status === 'Open').length;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        assigneeFilter={assigneeFilter}
        onAssigneeFilterChange={setAssigneeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        quickMember={quickMember}
        onQuickMemberChange={handleQuickMemberChange}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === 'table' ? 'timeline' : 'table')}
        showArchitecture={showArchitecture}
        onToggleArchitecture={() => setShowArchitecture(!showArchitecture)}
        onOpenAddModal={() => {
          setEditingTask(null);
          setIsAddModalOpen(true);
        }}
        onOpenBrainstorm={() => setIsBrainstormOpen(true)}
        onOpenDecisions={() => setIsDecisionsOpen(true)}
        onExport={exportBoardJson}
        onImport={importBoardJson}
        onReset={() => setIsResetConfirmOpen(true)}
        brainstormCount={brainstormIdeas.length}
        openDecisionsCount={openDecisionsCount}
        totalTasks={tasks.length}
      />

      {/* Hunt Architecture Reference Panel */}
      <HuntArchitecture
        isOpen={showArchitecture}
        onToggle={() => setShowArchitecture(!showArchitecture)}
      />

      {/* Dashboard Summary Metrics */}
      <DashboardSummary tasks={tasks} />

      {/* Recently Changed Quick Strip */}
      <RecentlyChanged tasks={recentlyChanged} onSelectTask={setEditingTask} />

      {/* Main Board Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 w-full">
        {viewMode === 'timeline' ? (
          <TimelineView tasks={displayedTasks} onSelectTask={setEditingTask} />
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
            {/* Table Control Header */}
            <div className="px-4 py-3 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Displaying:</span>
                <span className="font-bold text-cyan-400">
                  {displayedTasks.length} of {tasks.length} Objectives
                </span>
                {isFocusMode && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                    Focus Mode (Completed Hidden)
                  </span>
                )}
                {!canDrag && (
                  <span className="hidden lg:inline text-[11px] text-slate-500 italic">
                    (Drag-reorder enabled in default view without filters)
                  </span>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortOption)}
                  className="bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none font-mono"
                >
                  <option value="manual">Manual Order (Canonical Hunt Sequence)</option>
                  <option value="priority">Priority (Critical &rarr; Low)</option>
                  <option value="status">Status (Blocked &rarr; Done)</option>
                  <option value="assignee">Assignee Name</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>

            {/* Table Columns Title Bar */}
            <div className="grid grid-cols-12 items-center gap-2 px-3 py-2 sm:px-4 bg-slate-950/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <div className="col-span-2 sm:col-span-1 flex items-center gap-1">
                <span>#</span>
              </div>
              <div className="col-span-10 sm:col-span-4">
                <span>Task / Objective</span>
              </div>
              <div className="col-span-6 sm:col-span-2 hidden sm:block">
                <span>Assignee</span>
              </div>
              <div className="col-span-4 sm:col-span-2 hidden sm:block">
                <span>Status</span>
              </div>
              <div className="col-span-1 hidden lg:block">
                <span>Priority / Cat</span>
              </div>
              <div className="col-span-12 sm:col-span-2 text-right">
                <span>Actions</span>
              </div>
            </div>

            {/* Tasks List */}
            {displayedTasks.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-mono text-xs">
                <FolderOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-300 mb-1">
                  No matching objectives found
                </p>
                <p className="text-slate-500 mb-4 max-w-sm mx-auto">
                  Try adjusting your search criteria, reset active filters, or add a new task.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-mono text-xs uppercase"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {displayedTasks.map((task, index) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    serialNumber={task.order + 1}
                    isFirst={index === 0}
                    isLast={index === displayedTasks.length - 1}
                    canDrag={canDrag}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                    onEdit={setEditingTask}
                    onDelete={deleteTask}
                    onDuplicate={duplicateTask}
                    onMove={moveTask}
                    onUpdateNotes={(id, notes) => updateTask(id, { notes })}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div>
            ORBITAL CO. &bull; PROJECT ECLIPSE RESEARCH FACILITY &bull; TEAM COLLABORATION ENGINE
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>
              Keyboard: <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">N</kbd> New
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">/</kbd> Search
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">Ctrl+Z</kbd> Undo
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TaskModal
        isOpen={isAddModalOpen || editingTask !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
        totalTasks={tasks.length}
        onSave={addTask}
        onUpdate={updateTask}
      />

      <BrainstormModal
        isOpen={isBrainstormOpen}
        onClose={() => setIsBrainstormOpen(false)}
        ideas={brainstormIdeas}
        onAddIdea={addBrainstormIdea}
        onDeleteIdea={deleteBrainstormIdea}
        onConvertToTask={convertBrainstormToTask}
      />

      <DecisionsModal
        isOpen={isDecisionsOpen}
        onClose={() => setIsDecisionsOpen(false)}
        decisions={decisions}
        onAddDecision={addDecision}
        onUpdateDecision={updateDecision}
        onDeleteDecision={deleteDecision}
      />

      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetToInitial}
      />

      {/* Undo Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          action={toastMessage.action}
          actionLabel={toastMessage.actionLabel}
          onClose={dismissToast}
        />
      )}
    </div>
  );
}
