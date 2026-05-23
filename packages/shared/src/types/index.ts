// Shared types for VedaAI Assessment Creator

export interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  type: string;
}

export interface Assessment {
  id: string;
  title: string;
  dueDate: string;
  questions: Question[];
  totalMarks: number;
  createdAt: string;
}

export interface AssignmentConfig {
  title: string;
  dueDate: string;
  questionTypes: string[];
  questionCount: number;
  marksDistribution: number;
  instructions?: string;
  fileUrl?: string;
}

export interface GenerationJob {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  assessment?: Assessment;
  error?: string;
}
