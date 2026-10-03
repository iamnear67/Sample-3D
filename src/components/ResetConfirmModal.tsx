'use client';

import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetConfirmModal({ isOpen, onClose, onConfirm }: ResetConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-rose-500/50 rounded-xl shadow-2xl p-5 font-mono text-xs text-slate-200">
        <div className="flex items-center gap-3 text-rose-400 mb-3">
          <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-500/40">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              CONFIRM SYSTEM RESET
            </h3>
            <p className="text-[11px] text-rose-300">Irreversible Action Warning</p>
          </div>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed mb-4">
          Are you sure you want to reset the board back to the initial 52 ORBITAL hunt tasks? All current local changes, added tasks, and custom notes will be replaced with seed defaults.
        </p>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors uppercase"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(244,63,94,0.3)]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default (52 Tasks)
          </button>
        </div>
      </div>
    </div>
  );
}
