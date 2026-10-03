'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  FileCode,
  ShieldAlert,
  Binary,
  HardDrive,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';

interface HuntArchitectureProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function HuntArchitecture({ isOpen, onToggle }: HuntArchitectureProps) {
  if (!isOpen) return null;

  const routeSteps = [
    { label: 'START', type: 'terminal', desc: 'Game begins in classroom' },
    { label: 'Whiteboard Clue', type: 'step', desc: 'Projector cipher on wall' },
    { label: 'Local IP', type: 'step', desc: 'Decoding gateway address' },
    { label: 'Rebel Website', type: 'step', desc: 'Glitch underground portal' },
    { label: 'ORBITAL Website', type: 'step', desc: 'Public corporate facade' },
    { label: 'Employee Discovery', type: 'step', desc: 'Staff directory & photo metadata' },
    { label: 'Employee Login', type: 'step', desc: 'Initial authentication portal' },
    { label: 'Tier-4 Clearance', type: 'step', desc: 'Facilities & basic intranet' },
    { label: 'ORBIT Training', type: 'step', desc: 'AI persona interrogation' },
    { label: 'ORB Training', type: 'step', desc: 'Language grammar primer' },
    { label: 'Tier-3 Clearance', type: 'step', desc: 'Reactor & R&D lab access' },
    { label: 'Tier-2 Clearance', type: 'step', desc: 'High security division' },
    { label: 'ECLIPSE Discovery', type: 'step', desc: 'Rogue AI weapon revealed' },
    { label: 'GitHub Trail', type: 'step', desc: 'Simulated repo commits leak' },
    { label: '.gitignore Artifact', type: 'step', desc: 'Non-replacing fluff byte math' },
    { label: 'Construct .orb', type: 'step', desc: 'Craft <5MB compression bomb' },
    { label: 'WCC Console', type: 'step', desc: 'World Containment Console validation' },
    { label: 'ECLIPSE ABORTED', type: 'step', desc: 'Rogue system neutralized' },
    { label: 'WIN / PODIUM', type: 'terminal', desc: 'Final certificates & victory' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 animate-in fade-in duration-200">
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Glow border gradient effect */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600" />

        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono tracking-wider text-slate-100 uppercase flex items-center gap-2">
                HUNT ARCHITECTURE & PROJECT ECLIPSE REFERENCE
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  CLASSIFIED
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official single-engine story sequence, multi-tiered age brackets, and final WCC decompression math.
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700/80 transition-colors"
          >
            Collapse Panel <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Columns: Route Flow, Age Difficulty, ORB Mechanic Spec */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Column 1: Overall Flowchart (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Canonical Mission Route (18 Steps)</span>
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-2">
              {routeSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                      step.type === 'terminal'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                        : 'bg-slate-900 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 bg-slate-900/60 border border-slate-800/80 rounded px-2.5 py-1 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-200 font-medium">{step.label}</span>
                    <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                      {step.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Age Brackets & Core Principles (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase mb-2.5">
                <Info className="w-3.5 h-3.5" />
                <span>Age Groups Engine</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                One shared game engine configured for 3 distinct difficulty tiers:
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 rounded bg-purple-950/30 border border-purple-500/20">
                  <div className="text-purple-300 font-bold">Class 3–5 → Guided</div>
                  <div className="text-[11px] text-slate-400">
                    Visual patterns, token sliders, automatic math helpers.
                  </div>
                </div>
                <div className="p-2 rounded bg-blue-950/30 border border-blue-500/20">
                  <div className="text-blue-300 font-bold">Class 6–8 → Medium</div>
                  <div className="text-[11px] text-slate-400">
                    Scaffolding, progressive hint timers, moderate ciphers.
                  </div>
                </div>
                <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/20">
                  <div className="text-cyan-300 font-bold">Class 9–12 → Advanced</div>
                  <div className="text-[11px] text-slate-400">
                    Raw byte math, strict timing, minimal AI hints.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-amber-900/30 rounded-lg p-3.5">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Core Design Principle</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                Share the story, mechanics, and reasoning style. Do NOT share exact credentials,
                puzzle answers, hidden metadata, or team state.
              </p>
            </div>
          </div>

          {/* Column 3: ORB Final Mechanic Spec (4 cols) */}
          <div className="lg:col-span-4 bg-slate-950/70 border border-cyan-500/30 rounded-lg p-3.5 relative">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold uppercase mb-2">
              <Binary className="w-3.5 h-3.5 text-cyan-400" />
              <span>ORB Final Mechanic Spec</span>
            </div>
            <div className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              The final puzzle is a fictional <code className="text-cyan-300">.orb</code> byte payload uploaded to the WCC (World Containment Console).
            </div>

            <div className="space-y-2 text-xs font-mono bg-slate-900/80 border border-cyan-900/50 rounded-lg p-3">
              <div className="text-slate-200 font-bold text-[11px] uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
                WCC Upload Constraints:
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <span className="text-slate-300">
                    Physical <code className="text-cyan-300">.orb</code> file size <strong className="text-slate-100">&lt; 5 MB</strong> (max 5,242,880 bytes).
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <span className="text-slate-300">
                    Hypothetical regeneration output = <strong className="text-slate-100">exactly 1 GiB</strong> (1,073,741,824 bytes).
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <span className="text-slate-300">
                    Parsed password length = <strong className="text-slate-100">1,073,741,824 minus fluff bytes</strong> in the <code className="text-cyan-300">.gitignore</code> artifact.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded bg-rose-950/40 border border-rose-500/40 text-[11px] font-mono text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>
                <strong>CRITICAL RULE:</strong> Never actually generate 1 GiB in memory. The WCC mathematically verifies recursive compression syntax safely!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
