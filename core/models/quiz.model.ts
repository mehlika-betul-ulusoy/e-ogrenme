export interface Quiz {
  id: string;
  title: string;
  description: string;
  lessonId: string;
  questions: Question[];
  settings: QuizSettings;
  attempts?: QuizAttempt[];
  createdAt: Date;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

export interface QuizSettings {
  timeLimit?: number; // minutes
  maxAttempts: number;
  passingScore: number;
  showResults: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: QuizAnswer[];
  score: number;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number;
  isPassed: boolean;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  MATCHING = 'matching',
  FILL_BLANK = 'fill_blank'
}