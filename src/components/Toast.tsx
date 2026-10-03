'use client';

import React from 'react';
import { CheckCircle2, RotateCcw, X } from 'lucide-react';

interface ToastProps {
  message: string;
  action?: () => void;
  actionLabel?: string;
  onClose: () => void;
}

export function Toast({ message, action, actionLabel, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 border border-cyan-500/40 text-slate-100 rounded-lg shadow-2xl backdrop-blur-md text-sm animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="font-mono text-xs text-slate-300">{message}</span>
      </div>

      {action && actionLabel && (
        <button
          onClick={action}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 rounded transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          {actionLabel}
        </button>
      )}

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors ml-1"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
