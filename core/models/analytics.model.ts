export interface LearningAnalytics {
  userId: string;
  organizationId: string;
  courses: CourseAnalytics[];
  overallStats: OverallStats;
  engagement: EngagementMetrics;
  predictions?: LearningPredictions;
}

export interface CourseAnalytics {
  courseId: string;
  enrolledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  completionPercentage: number;
  timeSpent: number; // minutes
  quizScores: number[];
  averageScore: number;
  modules: ModuleAnalytics[];
  lastAccessedAt: Date;
}

export interface ModuleAnalytics {
  moduleId: string;
  completionPercentage: number;
  timeSpent: number;
  lessons: LessonAnalytics[];
}

export interface LessonAnalytics {
  lessonId: string;
  viewCount: number;
  timeSpent: number;
  isCompleted: boolean;
  completedAt?: Date;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface OverallStats {
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  totalTimeSpent: number;
  averageQuizScore: number;
  certificatesEarned: number;
  currentStreak: number;
  longestStreak: number;
}

export interface EngagementMetrics {
  dailyActivity: DailyActivity[];
  weeklyActivity: WeeklyActivity[];
  monthlyActivity: MonthlyActivity[];
  peakLearningHours: number[];
  preferredContentTypes: ContentTypePreference[];
}

export interface DailyActivity {
  date: Date;
  timeSpent: number;
  coursesAccessed: number;
  lessonsCompleted: number;
}

export interface WeeklyActivity {
  weekStart: Date;
  totalTime: number;
  coursesCompleted: number;
  averageDailyTime: number;
}

export interface MonthlyActivity {
  month: number;
  year: number;
  totalTime: number;
  coursesEnrolled: number;
  coursesCompleted: number;
  certificatesEarned: number;
}

// Lesson türleri
export enum LessonType {
  VIDEO = 'video',
  TEXT = 'text', 
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
  INTERACTIVE = 'interactive'
}

export interface ContentTypePreference {
  type: LessonType;
  percentage: number;
  averageTimeSpent: number;
}

export interface LearningPredictions {
  estimatedCompletionDate: Date;
  strugglingAreas: string[];
  recommendedCourses: string[];
  riskLevel: 'low' | 'medium' | 'high';
  suggestions: string[];
}