# ORBITAL Hunt — Build Board

> **"Plan the hunt. Break the system. Don't let ORBIT do all the work."**

A collaborative mission-planning and division-of-labor web app for the school AI Scavenger Hunt project, built for **You**, **Ruhaan**, and **Daksh**.

---

## ⚡ Mission Overview & Features

- **Single Shared Mission Board**: Real-time collaborative tracking for the entire 52-step scavenger hunt pipeline across three team members (**You**, **Ruhaan**, **Daksh**).
- **Dynamic Serial Numbering**: Serial numbers (1–52) automatically update and reindex whenever tasks are added, deleted, reordered, or filtered.
- **Drag-and-Drop Reordering**: Native smooth drag-and-drop vertically with instantaneous reindexing and persistence.
- **Full CRUD Capabilities**:
  - **Add Task** (`[N]` shortcut): Insert at the end, at the top, or after any specific task #.
  - **Edit Task**: Modify title, assignees, status, priority, category, dependency, and notes.
  - **Delete Task with Undo**: Confirmation guard plus floating Undo toast notification (`[Ctrl+Z]` supported).
  - **Duplicate Task**: Clone any task instantly right beneath the parent task.
  - **Inline Notes Editing**: Expandable multiline notes for rapid brainstorming and technical details.
- **Multi-Filter & Real-Time Search** (`[/]` shortcut): Filter by Assignee, Status, Priority, and Category simultaneously, or quickly filter by team member with 1-click **My Tasks** buttons.
- **Workload Summary & Progress Analytics**:
  - Live progress bar showing total hunt completion.
  - Multi-person assignment breakdown that fairly credits joint tasks (e.g. `You + Ruhaan` or `You + Ruhaan + Daksh`).
- **Hunt Architecture & Reference Panel**:
  - Interactive 18-step flowchart from the initial classroom projector clue to World Containment Console (WCC) abort sequence.
  - Multi-tiered age group matrix (Class 3–5 guided, Class 6–8 medium, Class 9–12 advanced).
  - Core Design Principle: *"Share the story, mechanics, and reasoning style; do NOT share exact credentials or team state."*
  - **ORB Final Mechanic Spec**: Strict 3-part constraint reference (< 5 MB physical, 1 GiB hypothetical expansion, parsed password math minus `.gitignore` fluff bytes).
- **Focus Mode**: 1-click toggle to hide completed tasks and reduce cognitive clutter during planning sessions.
- **Timeline View**: Visual chronological pipeline mapping tasks 1–52 as interconnected interactive nodes.
- **Brainstorm Hub**: Dedicated staging sandbox for unassigned ideas with 1-click **"Promote to Task"** conversion.
- **Decisions & Open Questions Log**: Track team consensus, open architectural queries, and resolved dilemmas.
- **Local Persistence & Data Portability**:
  - Zero-config auto-save to browser `localStorage`.
  - **Export Board JSON** & **Import Board JSON** for sharing state between laptops.
  - **Reset to Seed** with confirmation warning.
- **Aesthetic**: Dark, futuristic corporate interface inspired by fictional megacorp **ORBITAL CO.** with glowing accents, monospace telemetry typography, and high information density.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

To build and run in production:
```bash
npm run build
npm run start
```

---

## 🌐 Deploying to Vercel

### Option 1: Automatic GitHub Import (Recommended)
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete ORBITAL Hunt Build Board"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New Project"** &rarr; **"Import Git Repository"**.
4. Select `Sample-3D` (or your repo name).
5. Framework preset will automatically detect **Next.js**.
6. Click **"Deploy"**.

### Option 2: Deploying via Vercel CLI
```bash
# In the project directory:
npx vercel
# Follow the interactive prompts, accept defaults, and deploy!
```

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (Turbopack, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Custom Cyber Grid / Theme Tokens
- **Icons**: Lucide React
