'use client';

import React, { useState } from 'react';
import { DecisionNote } from '@/types/hunt';
import { FileQuestion, Plus, Trash2, CheckCircle2, Clock, HelpCircle, X, Edit2, Save } from 'lucide-react';

interface DecisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisions: DecisionNote[];
  onAddDecision: (topic: string, decision: string, status?: DecisionNote['status']) => void;
  onUpdateDecision: (id: string, updates: Partial<Omit<DecisionNote, 'id'>>) => void;
  onDeleteDecision: (id: string) => void;
}

export function DecisionsModal({
  isOpen,
  onClose,
  decisions,
  onAddDecision,
  onUpdateDecision,
  onDeleteDecision,
}: DecisionsModalProps) {
  const [newTopic, setNewTopic] = useState('');
  const [newDecision, setNewDecision] = useState('');
  const [newStatus, setNewStatus] = useState<DecisionNote['status']>('Open');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDecisionText, setEditDecisionText] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    onAddDecision(newTopic.trim(), newDecision.trim(), newStatus);
    setNewTopic('');
    setNewDecision('');
    setNewStatus('Open');
  };

  const getStatusBadge = (status: DecisionNote['status']) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-2.5 h-2.5" /> Resolved
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
            <Clock className="w-2.5 h-2.5" /> Under Review
          </span>
        );
      case 'Open':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-500/40">
            <HelpCircle className="w-2.5 h-2.5" /> Open Question
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-purple-500/40 rounded-xl shadow-2xl overflow-hidden font-mono text-xs flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <FileQuestion className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              DECISIONS // OPEN QUESTIONS LOG
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Add Decision Form */}
          <form onSubmit={handleAdd} className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-3">
            <div className="text-slate-200 font-bold uppercase text-[11px] text-purple-400 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add New Decision or Question
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Topic / Question (e.g. Do we want Rebel site before ORBITAL?)"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded px-3 py-1.5 text-slate-200 text-xs focus:outline-none"
                />
              </div>
              <div>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                >
                  <option value="Open">Status: Open</option>
                  <option value="In Progress">Status: In Progress</option>
                  <option value="Resolved">Status: Resolved</option>
                </select>
              </div>
            </div>

            <textarea
              rows={2}
              placeholder="Team consensus, current answer, or trade-offs..."
              value={newDecision}
              onChange={e => setNewDecision(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded px-3 py-1.5 text-slate-200 text-xs focus:outline-none font-mono"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-slate-100 font-bold uppercase tracking-wider text-[11px] transition-colors"
              >
                Record Decision
              </button>
            </div>
          </form>

          {/* Decisions List */}
          <div className="space-y-2.5">
            {decisions.map(item => (
              <div
                key={item.id}
                className="bg-slate-950/60 border border-purple-500/20 hover:border-purple-500/40 rounded-lg p-3.5 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(item.status)}
                      <h4 className="font-bold text-slate-200 text-xs">{item.topic}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={item.status}
                      onChange={e => onUpdateDecision(item.id, { status: e.target.value as any })}
                      className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none font-mono"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                    <button
                      onClick={() => onDeleteDecision(item.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="Delete Decision"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editingId === item.id ? (
                  <div className="space-y-1.5">
                    <textarea
                      rows={2}
                      value={editDecisionText}
                      onChange={e => setEditDecisionText(e.target.value)}
                      className="w-full bg-slate-900 border border-purple-500 rounded p-2 text-slate-200 text-xs focus:outline-none"
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => {
                          onUpdateDecision(item.id, { decision: editDecisionText });
                          setEditingId(null);
                        }}
                        className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[10px]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed flex justify-between items-start group">
                    <span>{item.decision || <span className="italic text-slate-500">No consensus recorded yet.</span>}</span>
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditDecisionText(item.decision);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-purple-400 hover:text-purple-300 p-0.5 transition-opacity"
                      title="Edit notes"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
