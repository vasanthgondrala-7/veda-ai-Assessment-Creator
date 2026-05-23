# VedaAI – AI Assessment Creator

AI-powered full-stack assessment generation platform built for educators to create structured question papers dynamically.

## Live Demo

🔗 https://ai-assessment-creator-6hcy.onrender.com

## GitHub Repository

🔗 https://github.com/vasanthgondrala-7/veda-ai-Assessment-Creator

---

## Overview

VedaAI is an intelligent assessment creation system that enables teachers to generate professional, structured question papers using AI.

The platform allows educators to:

- Create assignments
- Upload PDF/Text reference materials
- Configure question paper structure
- Generate AI-powered assessments
- View formatted output
- Download question papers as PDF
- Receive real-time generation updates

This project was developed as part of the **VedaAI Full Stack Engineering Assignment**.

---

## Features

### Assignment Creation

Teachers can configure:

- Assignment title
- Due date
- Question types
- Number of questions
- Marks distribution
- Additional instructions
- Optional PDF/Text file upload

---

### AI Question Generation

The system converts user inputs into structured prompts and generates:

- Section-wise question papers
- Difficulty categorization:
  - Easy
  - Medium
  - Hard
- Marks allocation
- Organized exam-ready output

---

### Real-Time Processing

WebSocket integration provides live updates for:

- Job queued
- Processing started
- Generation in progress
- Completion notification
- Error handling

---

### Structured Output View

Exam-paper styled output includes:

- Student information section
- Question sections
- Difficulty tags
- Marks allocation
- Clean academic formatting

---

### PDF Export

Generate and download properly formatted question papers as PDF.

---

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Zustand
- Tailwind CSS
- WebSockets

### Backend

- Node.js
- Express.js
- MongoDB
- Redis
- BullMQ

### AI Integration

- Prompt engineering
- Structured response parsing
- Dynamic question generation

### Deployment

- Render

---

## Architecture Overview

```text
Frontend (Next.js)
       ↓
REST API / WebSocket
       ↓
Express Backend
       ↓
BullMQ Queue
       ↓
AI Processing Worker
       ↓
MongoDB + Redis
       ↓
Real-time Update to Frontend
```

---

## Application Workflow

### 1. Assignment Submission

Teacher fills in assignment details.

### 2. Queue Processing

Request is added to BullMQ queue.

### 3. AI Generation

Worker:

- Processes structured prompt
- Generates questions
- Assigns difficulty levels
- Allocates marks

### 4. Storage

Generated output is stored in MongoDB.

### 5. Live Updates

Frontend receives WebSocket notifications.

### 6. Final Output

Structured question paper is rendered.

---

## Setup Instructions

### Clone Repository

```bash
git clone https://github.com/vasanthgondrala-7/veda-ai-Assessment-Creator.git
cd veda-ai-Assessment-Creator
```

---

### Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

---

### Environment Variables

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
REDIS_URL=your_redis_url
OPENAI_API_KEY=your_api_key
```

---

### Run Development Servers

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
npm run dev
```

---

## Key Engineering Decisions

### Queue-Based Architecture

BullMQ ensures:

- Asynchronous task execution
- Improved scalability
- Non-blocking API performance

---

### Redis Caching

Used for:

- Job state management
- Faster response handling
- Efficient queue tracking

---

### Structured AI Parsing

Raw LLM responses are normalized into structured JSON for consistent rendering.

---

### WebSocket Integration

Provides seamless real-time feedback during generation.

---

## Validation & Error Handling

Implemented validation for:

- Empty fields
- Negative values
- Invalid question count
- File upload failures
- AI generation errors

---

## Bonus Features Implemented

- PDF Export
- Responsive UI
- Real-time progress tracking
- Difficulty badges
- Enhanced output formatting

---

## Future Enhancements

- Multi-language assessment generation
- Teacher analytics dashboard
- Assessment templates
- Collaborative paper creation
- Difficulty customization

---

## Assignment Compliance Checklist

✅ Assignment Creation  
✅ AI Question Generation  
✅ MongoDB Storage  
✅ Redis Integration  
✅ BullMQ Queue  
✅ WebSocket Updates  
✅ Structured Output Rendering  
✅ PDF Export  
✅ Responsive Design  

---

## Deployment

Production URL:

https://ai-assessment-creator-6hcy.onrender.com

---

## Author

**Vasanth Gondrala**  
Senior MERN Full Stack Developer

GitHub: https://github.com/vasanthgondrala-7

---

## Project Outcome

This project demonstrates scalable full-stack architecture, AI workflow orchestration, asynchronous processing, and real-time communication aligned with VedaAI engineering assignment requirements.
