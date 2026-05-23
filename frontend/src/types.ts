// Trigger git sync render

export interface Assignment {
  id: string;
  subject?: string;
  grade?: string;
  marks?: number;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  error?: string;
  createdAt: string;
  dueDate: string;
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | string;
  marks: number;
}

export interface PaperSection {
  title: string;
  instructions?: string;
  questions: Question[];
}

export interface GeneratedPaper {
  sections: PaperSection[];
}
