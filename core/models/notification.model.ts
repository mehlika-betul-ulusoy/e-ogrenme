export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export enum NotificationType {
  COURSE_ASSIGNED = 'course_assigned',
  COURSE_COMPLETED = 'course_completed',
  QUIZ_AVAILABLE = 'quiz_available',
  DEADLINE_REMINDER = 'deadline_reminder',
  CERTIFICATE_EARNED = 'certificate_earned',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  CURRICULUM_UPDATED = 'curriculum_updated',
  LIVE_SESSION = 'live_session',
  SYSTEM = 'system'
}