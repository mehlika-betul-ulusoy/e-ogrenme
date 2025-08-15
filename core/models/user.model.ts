export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  EDUCATION_MANAGER = 'education_manager',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
  OBSERVER = 'observer'
}