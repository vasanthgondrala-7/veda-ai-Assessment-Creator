# Veda AI - AI Assessment Creator

An automated, full-stack AI Assessment Creator designed for educators to easily generate structured question papers. The application accepts parameters like topic, due dates, question types, difficulty, and marks, leveraging a robust backend queue system to handle LLM generation and export structured exam papers asynchronously.

**Live Deployment:** [Veda AI Assessment Creator](https://ai-assessment-creator-6hcy.onrender.com)

---

## 🚀 Features

### Core Features
- **Assignment Creation Form:** Intuitive UI built with validation to prevent empty or negative values. Supports custom due dates, question type selection, number of questions, and distribution of marks.
- **AI Question Generation:** Converts teacher inputs into structured, deterministic prompts. Generates cleanly divided sections (e.g., Section A, Section B) with explicit marks and difficulty tags (Easy, Moderate, Hard).
- **Asynchronous Processing Pipeline:** Prevents request timeouts by shifting heavy LLM generation workloads to a background worker queue.
- **Real-Time Progress Updates:** Emits real-time state changes from the backend worker directly to the client UI using WebSockets.
- **Structured Output View:** Renders the generated question paper in a clean, high-hierarchy academic format complete with Student Info blocks (Name, Roll Number, Section).

### High-Signal Bonus Features
- **PDF Export Utility:** Converts the structured exam paper into a beautifully formatted, print-ready PDF layout rather than a raw HTML print block.
- **Visual Distinction Badges:** Dynamically highlights question complexities via localized UI badges.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Zustand (State Management)
- **Backend:** Node.js, Express, TypeScript
- **Database & Caching:** MongoDB (Data Persistence), Redis (Job Tracking & Caching)
- **Task Orchestration:** BullMQ (Background Job Queue Management)
- **Real-time Layer:** WebSocket / Socket.io
- **AI Integration:** Google Gemini SDK (Structured Prompt Engineering & JSON Parsing)

---

## 📐 Architecture Overview

The system architecture is engineered to isolate long-running AI processes from the main application thread to guarantee high availability and snappy responsiveness:
