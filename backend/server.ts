import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import url from 'url';

dotenv.config();

const currentDir = process.cwd();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface QuestionTypeConfig {
  type: string;
  count: number;
  marks: number;
}

interface Assignment {
  id: string;
  subject: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  numberOfQuestions: number;
  marks: number;
  instructions: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  createdAt: number;
}

interface GeneratedPaper {
  assignmentId: string;
  paper: any; 
}

const db = {
  assignments: new Map<string, Assignment>(),
  papers: new Map<string, GeneratedPaper>()
};

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: '*' }
  });

  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/assignments', (req, res) => {
    const list = Array.from(db.assignments.values()).sort((a, b) => b.createdAt - a.createdAt);
    res.json(list);
  });

  app.get('/api/assignments/:id', (req, res) => {
    const assignment = db.assignments.get(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json({
      assignment,
      paper: db.papers.get(req.params.id)?.paper || null
    });
  });

  app.post('/api/assignments', async (req, res) => {
    const body = req.body;
    const assignmentId = uuidv4();
    
    const newAssignment: Assignment = {
      id: assignmentId,
      subject: body.subject || 'General',
      dueDate: body.dueDate || new Date().toISOString(),
      questionTypes: body.questionTypes || [],
      numberOfQuestions: body.numberOfQuestions || 10,
      marks: body.marks || 100,
      instructions: body.instructions || '',
      status: 'pending',
      createdAt: Date.now()
    };

    db.assignments.set(assignmentId, newAssignment);
    res.json(newAssignment);
    
    simulateJobQueue(newAssignment, io);
  });
  
  app.post('/api/assignments/:id/regenerate', async (req, res) => {
    const assignment = db.assignments.get(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    assignment.status = 'pending';
    db.assignments.set(assignment.id, assignment);
    db.papers.delete(assignment.id);
    
    simulateJobQueue(assignment, io);
    res.json(assignment);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: path.join(process.cwd(), 'frontend')
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

async function simulateJobQueue(assignment: Assignment, io: SocketIOServer) {
  assignment.status = 'generating';
  db.assignments.set(assignment.id, assignment);
  io.emit('job:update', assignment);
  
  try {
    const paper = await generateQuestionPaper(assignment);
    
    assignment.status = 'completed';
    db.assignments.set(assignment.id, assignment);
    db.papers.set(assignment.id, { assignmentId: assignment.id, paper });
    
    io.emit('job:update', assignment);
    io.emit('job:completed', { assignmentId: assignment.id, paper });
    
  } catch (error) {
    console.error('Job failed:', error);
    assignment.status = 'failed';
    db.assignments.set(assignment.id, assignment);
    io.emit('job:update', assignment);
  }
}

async function generateQuestionPaper(assignment: Assignment) {
   const typesDesc = assignment.questionTypes.map(qt => `${qt.count} questions of type '${qt.type}' worth ${qt.marks} marks combined`).join(', ');
   
   const prompt = `
     You are an expert educator. Create a structured exam paper based on the following requirements:
     Subject: ${assignment.subject}
     Total Questions: ${assignment.numberOfQuestions}
     Total Marks: ${assignment.marks}
     Question Breakdown: ${typesDesc}
     Additional Instructions: ${assignment.instructions}
     
     Group the questions into logical sections (e.g., Section A, Section B). 
     Assign a difficulty (Easy, Moderate, Hard) and marks to each question.
     Ensure the sum of marks equal the total marks ${assignment.marks}.
     Ensure the number of questions matches the breakdown requested.
   `;

   const responseSchema = {
     type: Type.OBJECT,
     properties: {
       title: { type: Type.STRING },
       sections: {
         type: Type.ARRAY,
         items: {
           type: Type.OBJECT,
           properties: {
             title: { type: Type.STRING },
             instructions: { type: Type.STRING },
             questions: {
               type: Type.ARRAY,
               items: {
                 type: Type.OBJECT,
                 properties: {
                   id: { type: Type.STRING },
                   text: { type: Type.STRING },
                   difficulty: { type: Type.STRING, enum: ['Easy', 'Moderate', 'Hard'] },
                   marks: { type: Type.INTEGER }
                 },
                 required: ["id", "text", "difficulty", "marks"]
               }
             }
           },
           required: ["title", "instructions", "questions"]
         }
       }
     },
     required: ["title", "sections"]
   };

   const modelName = 'gemini-2.5-flash';
   const response = await ai.models.generateContent({
     model: modelName,
     contents: prompt,
     config: {
       responseMimeType: 'application/json',
       responseSchema: responseSchema,
       temperature: 0.7,
     }
   });
   
   if (!response.text) {
     throw new Error("No payload returned from Gemini");
   }

   return JSON.parse(response.text);
}

startServer();

// Trigger git sync for render fix
