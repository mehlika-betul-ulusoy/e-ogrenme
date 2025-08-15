import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { 
  Course, 
  DifficultyLevel, 
  CertificateType, 
  EnrollmentMethod,
  BulkStudentEnrollment,
  StudentEnrollmentData,
  CourseInvitation
} from '../../../core/models/course.model';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.scss']
})
export class CourseManagementComponent implements OnInit {
  courseForm!: FormGroup;
  enrollmentForm!: FormGroup;
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  invitations: CourseInvitation[] = [];
  
  // Enums for templates
  difficultyLevels = Object.values(DifficultyLevel);
  certificateTypes = Object.values(CertificateType);
  enrollmentMethods = Object.values(EnrollmentMethod);

  // UI State
  showCourseForm = false;
  showEnrollmentPanel = false;
  activeTab = 'create'; // create, enroll, invitations
  bulkEnrollmentData: StudentEnrollmentData[] = [];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  private initializeForms(): void {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      tags: [''],
      difficultyLevel: [DifficultyLevel.BEGINNER, Validators.required],
      estimatedDuration: [60, [Validators.required, Validators.min(15)]],
      prerequisites: [''],
      certificateType: [CertificateType.COMPLETION, Validators.required],
      maxStudents: [null, Validators.min(1)],
      allowSelfEnrollment: [false],
      requiresApproval: [true]
    });

    this.enrollmentForm = this.fb.group({
      enrollmentMethod: [EnrollmentMethod.MANUAL, Validators.required],
      studentEmail: ['', [Validators.email]],
      studentFirstName: [''],
      studentLastName: [''],
      departmentId: [''],
      csvData: ['']
    });
  }

  private loadCourses(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  // Kurs Oluşturma
  onSubmitCourse(): void {
    if (this.courseForm.valid) {
      const formData = this.courseForm.value;
      
      const courseData: Partial<Course> = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
        difficultyLevel: formData.difficultyLevel,
        estimatedDuration: formData.estimatedDuration,
        prerequisites: formData.prerequisites ? formData.prerequisites.split(',').map((p: string) => p.trim()) : [],
        certificateType: formData.certificateType,
        organizationId: '1', // Mock organization ID
        instructorId: 'current-user-id', // Mock instructor ID
        enrollmentSettings: {
          method: EnrollmentMethod.MANUAL,
          isOpen: formData.allowSelfEnrollment,
          requiresApproval: formData.requiresApproval,
          maxStudents: formData.maxStudents,
          invitationCodes: [],
          departmentAccess: []
        }
      };

      this.courseService.createCourse(courseData).subscribe({
        next: (course) => {
          console.log('Course created:', course);
          this.courseForm.reset();
          this.showCourseForm = false;
          this.loadCourses();
        },
        error: (error) => {
          console.error('Error creating course:', error);
        }
      });
    }
  }

  // Öğrenci Kaydı
  onSubmitEnrollment(): void {
    if (!this.selectedCourse) return;

    const formData = this.enrollmentForm.value;
    
    switch (formData.enrollmentMethod) {
      case EnrollmentMethod.MANUAL:
        this.enrollStudentManually(formData);
        break;
      case EnrollmentMethod.CSV_UPLOAD:
        this.enrollStudentsFromCSV(formData.csvData);
        break;
      case EnrollmentMethod.DEPARTMENT_AUTO:
        this.enrollByDepartment(formData.departmentId);
        break;
    }
  }

  private enrollStudentManually(formData: any): void {
    if (!this.selectedCourse) return;

    const studentData = {
      email: formData.studentEmail,
      firstName: formData.studentFirstName,
      lastName: formData.studentLastName
    };

    this.courseService.enrollStudentManually(this.selectedCourse.id, studentData).subscribe({
      next: (success) => {
        if (success) {
          console.log('Student enrolled successfully');
          this.enrollmentForm.reset();
        }
      },
      error: (error) => {
        console.error('Error enrolling student:', error);
      }
    });
  }

  private enrollStudentsFromCSV(csvData: string): void {
    if (!this.selectedCourse || !csvData.trim()) return;

    try {
      const lines = csvData.trim().split('\n');
      const students: StudentEnrollmentData[] = [];

      for (let i = 1; i < lines.length; i++) { // Skip header
        const [email, firstName, lastName, departmentId] = lines[i].split(',').map(field => field.trim());
        
        if (email && firstName && lastName) {
          students.push({
            email,
            firstName,
            lastName,
            departmentId: departmentId || undefined,
            sendInvitation: true
          });
        }
      }

      if (students.length > 0) {
        const enrollmentData: BulkStudentEnrollment = {
          courseId: this.selectedCourse.id,
          students,
          enrollmentMethod: EnrollmentMethod.CSV_UPLOAD
        };

        this.courseService.bulkEnrollStudents(enrollmentData).subscribe({
          next: (result) => {
            console.log(`Enrolled ${result.success} students, ${result.failed} failed`);
            this.enrollmentForm.reset();
          },
          error: (error) => {
            console.error('Error in bulk enrollment:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error parsing CSV data:', error);
    }
  }

  private enrollByDepartment(departmentId: string): void {
    if (!this.selectedCourse || !departmentId) return;

    this.courseService.enrollByDepartment(this.selectedCourse.id, departmentId).subscribe({
      next: (result) => {
        console.log(`Enrolled ${result.success} students from department`);
        this.enrollmentForm.reset();
      },
      error: (error) => {
        console.error('Error in department enrollment:', error);
      }
    });
  }

  // Davet Sistemi
  generateInvitation(studentEmail?: string): void {
    if (!this.selectedCourse) return;

    this.courseService.createInvitation(this.selectedCourse.id, studentEmail).subscribe({
      next: (invitation) => {
        console.log('Invitation created:', invitation);
        this.loadInvitations();
      },
      error: (error) => {
        console.error('Error creating invitation:', error);
      }
    });
  }

  private loadInvitations(): void {
    if (!this.selectedCourse) return;

    this.courseService.getInvitations(this.selectedCourse.id).subscribe(invitations => {
      this.invitations = invitations;
    });
  }

  // UI Methods
  selectCourse(course: Course): void {
    this.selectedCourse = course;
    this.showEnrollmentPanel = true;
    this.loadInvitations();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleCourseForm(): void {
    this.showCourseForm = !this.showCourseForm;
  }

  closePanels(): void {
    this.showCourseForm = false;
    this.showEnrollmentPanel = false;
    this.selectedCourse = null;
  }

  // Helper Methods
  getDifficultyColor(level: DifficultyLevel): string {
    switch (level) {
      case DifficultyLevel.BEGINNER: return 'success';
      case DifficultyLevel.INTERMEDIATE: return 'warning';
      case DifficultyLevel.ADVANCED: return 'danger';
      case DifficultyLevel.EXPERT: return 'dark';
      default: return 'secondary';
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  }
}
