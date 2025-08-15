import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  Course, 
  CourseInvitation, 
  BulkStudentEnrollment, 
  InvitationStatus,
  EnrollmentMethod,
  CertificateType,
  DifficultyLevel
} from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  private invitationsSubject = new BehaviorSubject<CourseInvitation[]>([]);

  constructor() {
    this.loadMockCourses();
    this.loadMockInvitations();
  }

  // Course CRUD operasyonları
  getCourses(): Observable<Course[]> {
    return this.coursesSubject.asObservable();
  }

  getCourseById(id: string): Observable<Course | null> {
    return this.coursesSubject.pipe(
      map(courses => courses.find(course => course.id === id) || null)
    );
  }

  createCourse(courseData: Partial<Course>): Observable<Course> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const newCourse: Course = {
          id: this.generateId(),
          title: courseData.title!,
          description: courseData.description || '',
          organizationId: courseData.organizationId!,
          instructorId: courseData.instructorId!,
          instructorName: courseData.instructorName || 'Instructor',
          category: courseData.category || 'General',
          tags: courseData.tags || [],
          difficultyLevel: courseData.difficultyLevel || DifficultyLevel.BEGINNER,
          estimatedDuration: courseData.estimatedDuration || 60,
          prerequisites: courseData.prerequisites || [],
          certificateType: courseData.certificateType || CertificateType.COMPLETION,
          enrollmentSettings: {
            method: EnrollmentMethod.MANUAL,
            isOpen: false,
            requiresApproval: true,
            invitationCodes: [],
            departmentAccess: [],
            ...courseData.enrollmentSettings
          },
          modules: [],
          settings: {
            allowSelfEnrollment: false,
            ...courseData.settings
          },
          stats: {
            enrolledStudents: 0,
            completedStudents: 0,
            averageCompletionTime: 0,
            averageRating: 0,
            totalRatings: 0
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const currentCourses = this.coursesSubject.value;
        this.coursesSubject.next([...currentCourses, newCourse]);
        
        return newCourse;
      })
    );
  }

  updateCourse(id: string, updates: Partial<Course>): Observable<Course> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const courses = this.coursesSubject.value;
        const courseIndex = courses.findIndex(c => c.id === id);
        
        if (courseIndex === -1) {
          throw new Error('Course not found');
        }

        const updatedCourse = {
          ...courses[courseIndex],
          ...updates,
          updatedAt: new Date()
        };

        courses[courseIndex] = updatedCourse;
        this.coursesSubject.next([...courses]);
        
        return updatedCourse;
      })
    );
  }

  deleteCourse(id: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const courses = this.coursesSubject.value;
        const filteredCourses = courses.filter(c => c.id !== id);
        this.coursesSubject.next(filteredCourses);
        return true;
      })
    );
  }

  // Öğrenci Kayıt Yönetimi
  enrollStudentManually(courseId: string, studentData: { email: string, firstName: string, lastName: string }): Observable<boolean> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Mock enrollment logic
        console.log(`Student ${studentData.email} enrolled in course ${courseId}`);
        return true;
      })
    );
  }

  bulkEnrollStudents(enrollmentData: BulkStudentEnrollment): Observable<{ success: number, failed: number }> {
    return of(null).pipe(
      delay(2000),
      map(() => {
        // Mock bulk enrollment logic
        const successCount = enrollmentData.students.length;
        console.log(`Bulk enrolled ${successCount} students`);
        
        // Update course stats
        this.updateCourseStats(enrollmentData.courseId, { enrolledStudents: successCount });
        
        return { success: successCount, failed: 0 };
      })
    );
  }

  enrollByDepartment(courseId: string, departmentId: string): Observable<{ success: number, failed: number }> {
    return of(null).pipe(
      delay(1500),
      map(() => {
        // Mock department enrollment logic
        const enrolledCount = Math.floor(Math.random() * 20) + 5; // 5-25 students
        console.log(`Enrolled ${enrolledCount} students from department ${departmentId}`);
        
        this.updateCourseStats(courseId, { enrolledStudents: enrolledCount });
        
        return { success: enrolledCount, failed: 0 };
      })
    );
  }

  // Davet Sistemi
  createInvitation(courseId: string, studentEmail?: string): Observable<CourseInvitation> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const invitation: CourseInvitation = {
          id: this.generateId(),
          courseId,
          invitationCode: this.generateInvitationCode(),
          createdBy: 'current-user-id', // Mock user ID
          studentEmail,
          status: InvitationStatus.PENDING,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          createdAt: new Date()
        };

        const currentInvitations = this.invitationsSubject.value;
        this.invitationsSubject.next([...currentInvitations, invitation]);

        // Store invitation code in localStorage for demo
        this.storeInvitationInLocalStorage(invitation);

        return invitation;
      })
    );
  }

  acceptInvitation(invitationCode: string, studentData: { email: string, firstName: string, lastName: string }): Observable<boolean> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const invitations = this.invitationsSubject.value;
        const invitation = invitations.find(inv => 
          inv.invitationCode === invitationCode && 
          inv.status === InvitationStatus.PENDING &&
          inv.expiresAt > new Date()
        );

        if (!invitation) {
          throw new Error('Invalid or expired invitation code');
        }

        // Update invitation status
        invitation.status = InvitationStatus.ACCEPTED;
        invitation.usedAt = new Date();
        invitation.usedBy = studentData.email;

        this.invitationsSubject.next([...invitations]);

        // Enroll student
        this.enrollStudentManually(invitation.courseId, studentData);

        // Remove from localStorage
        this.removeInvitationFromLocalStorage(invitationCode);

        return true;
      })
    );
  }

  getInvitations(courseId?: string): Observable<CourseInvitation[]> {
    return this.invitationsSubject.pipe(
      map(invitations => courseId ? 
        invitations.filter(inv => inv.courseId === courseId) : 
        invitations
      )
    );
  }

  // LocalStorage Yönetimleri (Demo için)
  private storeInvitationInLocalStorage(invitation: CourseInvitation): void {
    const invitations = this.getInvitationsFromLocalStorage();
    invitations.push({
      code: invitation.invitationCode,
      courseId: invitation.courseId,
      expiresAt: invitation.expiresAt.toISOString(),
      createdAt: invitation.createdAt.toISOString()
    });
    localStorage.setItem('course_invitations', JSON.stringify(invitations));
  }

  private removeInvitationFromLocalStorage(code: string): void {
    const invitations = this.getInvitationsFromLocalStorage();
    const filtered = invitations.filter(inv => inv.code !== code);
    localStorage.setItem('course_invitations', JSON.stringify(filtered));
  }

  getInvitationsFromLocalStorage(): any[] {
    const stored = localStorage.getItem('course_invitations');
    return stored ? JSON.parse(stored) : [];
  }

  // Utility Methods
  private updateCourseStats(courseId: string, stats: Partial<any>): void {
    const courses = this.coursesSubject.value;
    const course = courses.find(c => c.id === courseId);
    if (course) {
      course.stats = { ...course.stats, ...stats };
      this.coursesSubject.next([...courses]);
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private generateInvitationCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  // Mock Data
  private loadMockCourses(): void {
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Angular Fundamentals',
        description: 'Learn the basics of Angular framework',
        organizationId: '1',
        instructorId: 'instructor-1',
        instructorName: 'John Doe',
        category: 'Programming',
        tags: ['Angular', 'TypeScript', 'Frontend'],
        difficultyLevel: DifficultyLevel.BEGINNER,
        estimatedDuration: 120,
        prerequisites: [],
        certificateType: CertificateType.COMPLETION,
        enrollmentSettings: {
          method: EnrollmentMethod.MANUAL,
          isOpen: false,
          requiresApproval: true,
          invitationCodes: [],
          departmentAccess: ['dep-1']
        },
        modules: [],
        settings: {
          allowSelfEnrollment: false,
          maxStudents: 30
        },
        stats: {
          enrolledStudents: 15,
          completedStudents: 8,
          averageCompletionTime: 110,
          averageRating: 4.5,
          totalRatings: 12
        },
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-01')
      }
    ];

    this.coursesSubject.next(mockCourses);
  }

  private loadMockInvitations(): void {
    const mockInvitations: CourseInvitation[] = [];
    this.invitationsSubject.next(mockInvitations);
  }
}
