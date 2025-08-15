export interface Course {
  id: string;
  title: string;
  description: string;
  organizationId: string;
  instructorId: string;
  instructorName: string;
  category: string;
  tags: string[];
  difficultyLevel: DifficultyLevel;
  estimatedDuration: number; // minutes
  prerequisites: string[]; // course IDs
  certificateType: CertificateType;
  enrollmentSettings: EnrollmentSettings;
  modules: CourseModule[];
  settings: CourseSettings;
  stats: CourseStats;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  requirements: ModuleRequirements;
  isCompleted?: boolean;
  completionPercentage?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  content: LessonContent;
  order: number;
  duration: number; // minutes
  isRequired: boolean;
  subLessons?: SubLesson[];
  isCompleted?: boolean;
  completedAt?: Date;
  timeSpent?: number;
}

export interface SubLesson {
  id: string;
  title: string;
  content: LessonContent;
  order: number;
  isCompleted?: boolean;
}

export interface LessonContent {
  type: 'text' | 'video' | 'audio' | 'pdf' | 'interactive';
  data: string; // base64 or text content
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64
}

export interface ModuleRequirements {
  minCompletionRate: number;
  passingScore?: number;
  requiredActivities: string[];
}

export interface CourseSettings {
  allowSelfEnrollment: boolean;
  maxStudents?: number;
  startDate?: Date;
  endDate?: Date;
  certificateTemplate?: string;
}

export interface CourseStats {
  enrolledStudents: number;
  completedStudents: number;
  averageCompletionTime: number;
  averageRating: number;
  totalRatings: number;
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum LessonType {
  READING = 'reading',
  VIDEO = 'video',
  AUDIO = 'audio',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
  INTERACTIVE = 'interactive'
}

export enum CertificateType {
  COMPLETION = 'completion',
  ACHIEVEMENT = 'achievement',
  PARTICIPATION = 'participation',
  NONE = 'none'
}

export interface EnrollmentSettings {
  method: EnrollmentMethod;
  isOpen: boolean;
  requiresApproval: boolean;
  maxStudents?: number;
  enrollmentDeadline?: Date;
  invitationCodes: string[];
  departmentAccess: string[]; // department IDs
}

export enum EnrollmentMethod {
  MANUAL = 'manual',
  CSV_UPLOAD = 'csv_upload',
  DEPARTMENT_AUTO = 'department_auto',
  INVITATION_CODE = 'invitation_code',
  SELF_ENROLLMENT = 'self_enrollment'
}

// Davet sistemi için interface'ler
export interface CourseInvitation {
  id: string;
  courseId: string;
  invitationCode: string;
  createdBy: string;
  studentEmail?: string;
  status: InvitationStatus;
  expiresAt: Date;
  usedAt?: Date;
  usedBy?: string;
  createdAt: Date;
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

// Toplu öğrenci kaydı için interface
export interface BulkStudentEnrollment {
  courseId: string;
  students: StudentEnrollmentData[];
  enrollmentMethod: EnrollmentMethod;
  departmentId?: string;
}

export interface StudentEnrollmentData {
  email: string;
  firstName: string;
  lastName: string;
  departmentId?: string;
  sendInvitation?: boolean;
}