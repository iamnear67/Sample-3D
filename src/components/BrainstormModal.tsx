'use client';

import React, { useState } from 'react';
import { BrainstormIdea, TeamMember } from '@/types/hunt';
import { Lightbulb, Plus, Trash2, ArrowRightCircle, X, User } from 'lucide-react';

interface BrainstormModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: BrainstormIdea[];
  onAddIdea: (idea: string, notes: string, suggestedBy: TeamMember | 'All') => void;
  onDeleteIdea: (id: string) => void;
  onConvertToTask: (ideaId: string) => void;
}

export function BrainstormModal({
  isOpen,
  onClose,
  ideas,
  onAddIdea,
  onDeleteIdea,
  onConvertToTask,
}: BrainstormModalProps) {
  const [newIdea, setNewIdea] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [suggestedBy, setSuggestedBy] = useState<TeamMember | 'All'>('You');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;
    onAddIdea(newIdea.trim(), newNotes.trim(), suggestedBy);
    setNewIdea('');
    setNewNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-yellow-500/40 rounded-xl shadow-2xl overflow-hidden font-mono text-xs flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              BRAINSTORM HUB // FREEFORM IDEAS
            </h3>
            <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 text-[10px]">
              {ideas.length} unassigned ideas
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informative notice */}
        <div className="px-5 py-2.5 bg-yellow-950/20 border-b border-yellow-500/20 text-slate-400 text-[11px] leading-relaxed">
          These ideas are <strong>not</strong> part of the official 52-step hunt sequence yet. Team members can freely pitch mechanics, red herrings, or lore quirks here, then click <span className="text-yellow-300">"Promote to Task"</span> when ready.
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Add Idea Form */}
          <form onSubmit={handleAdd} className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-3">
            <div className="text-slate-200 font-bold uppercase text-[11px] text-yellow-400 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Pitch New Idea
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Idea summary (e.g. Inverted monitor sabotage, audio morse code)"
                  value={newIdea}
                  onChange={e => setNewIdea(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-yellow-500 rounded px-3 py-1.5 text-slate-200 text-xs focus:outline-none"
                />
              </div>
              <div>
                <select
                  value={suggestedBy}
                  onChange={e => setSuggestedBy(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-yellow-500 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                >
                  <option value="You">Suggested by: You</option>
                  <option value="Ruhaan">Suggested by: Ruhaan</option>
                  <option value="Daksh">Suggested by: Daksh</option>
                  <option value="All">Suggested by: All</option>
                </select>
              </div>
            </div>

            <textarea
              rows={2}
              placeholder="Context, narrative justification, or puzzle mechanics..."
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-yellow-500 rounded px-3 py-1.5 text-slate-200 text-xs focus:outline-none font-mono"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold uppercase tracking-wider text-[11px] transition-colors"
              >
                Save Idea
              </button>
            </div>
          </form>

          {/* Ideas List */}
          <div className="space-y-2.5">
            {ideas.length === 0 ? (
              <div className="text-center py-8 text-slate-500 font-mono">
                No active brainstorm ideas. Add one above!
              </div>
            ) : (
              ideas.map(item => (
                <div
                  key={item.id}
                  className="bg-slate-950/60 border border-yellow-500/20 hover:border-yellow-500/40 rounded-lg p-3.5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-bold text-slate-200 text-xs">{item.idea}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-[10px] text-yellow-400/90 font-mono">
                          <User className="w-2.5 h-2.5" /> Pitch: {item.suggestedBy}
                        </span>
                        <span className="text-slate-600 text-[10px]">&bull;</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onConvertToTask(item.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 font-bold text-[10px] transition-colors"
                        title="Promote this idea to an official hunt task"
                      >
                        <ArrowRightCircle className="w-3 h-3" />
                        Promote to Task
                      </button>
                      <button
                        onClick={() => onDeleteIdea(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        title="Delete Idea"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {item.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
