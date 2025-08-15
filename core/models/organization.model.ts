import { UserRole } from './user.model';

export interface Organization {
  id: string;
  name: string;
  description: string;
  logo?: string;
  domain?: string;
  settings: OrganizationSettings;
  stats: OrganizationStats;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSettings {
  allowSelfRegistration: boolean;
  defaultUserRole: UserRole;
  branding: BrandingSettings;
  features: FeatureSettings;
  theme: 'light' | 'dark';
}

export interface OrganizationStats {
  totalUsers: number;
  totalCourses: number;
  totalCompletions: number;
  activeUsers: number;
  avgCourseCompletion: number;
}

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  favicon?: string;
}

export interface FeatureSettings {
  enableGamification: boolean;
  enableReports: boolean;
  enableCertificates: boolean;
  enableDiscussions: boolean;
  enableLiveSessions: boolean;
}
