export interface Assignment {
  id: string;
  subject?: string;
  marks?: number;
  status: 'pending' | 'generating' | 'completed' | 'failed';
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
