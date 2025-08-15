import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface Course {
  id: number;
  title: string;
  lessons: Lesson[];
  announcements: Announcement[];
}

interface Lesson {
  id: number;
  title: string;
  durationMinutes: number;
}

interface Announcement {
  id: number;
  message: string;
  datePosted: Date;
}

interface User {
  id: number;
  fullName: string;
}

@Component({
  selector: 'app-education-manager-dashboard',
  templateUrl: './education-manager-dashboard.component.html',
  styleUrls: ['./education-manager-dashboard.component.scss']
})
export class EducationManagerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  selectedLesson: Lesson | null = null;

  newLessonTitle: string = '';
  newLessonDuration: number = 0;
  newAnnouncement: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData(): void {
    this.currentUser = {
      id: 1,
      fullName: 'Eğitim Yöneticisi'
    };

    this.courses = [
      {
        id: 1,
        title: 'Angular Geliştirme',
        lessons: [
          { id: 1, title: 'Angular Temelleri', durationMinutes: 60 },
          { id: 2, title: 'Componentler', durationMinutes: 45 }
        ],
        announcements: [
          {
            id: 1,
            message: 'Kurs başlangıç tarihi güncellendi.',
            datePosted: new Date('2024-08-01')
          }
        ]
      },
      {
        id: 2,
        title: 'TypeScript Programlama',
        lessons: [
          { id: 3, title: 'TypeScript Temelleri', durationMinutes: 90 },
          { id: 4, title: 'İleri TypeScript', durationMinutes: 120 }
        ],
        announcements: [
          {
            id: 2,
            message: 'Yeni materyaller eklendi.',
            datePosted: new Date('2024-08-05')
          }
        ]
      }
    ];
  }

  selectCourse(courseId: string): void {
    const id = parseInt(courseId);
    this.selectedCourse = this.courses.find(c => c.id === id) || null;
    this.selectedLesson = null;
  }

  selectLesson(lessonId: number): void {
    if (this.selectedCourse) {
      this.selectedLesson = this.selectedCourse.lessons.find(l => l.id === lessonId) || null;
    }
  }

  addLesson(): void {
    if (this.selectedCourse && this.newLessonTitle && this.newLessonDuration > 0) {
      const newLesson: Lesson = {
        id: Date.now(),
        title: this.newLessonTitle,
        durationMinutes: this.newLessonDuration
      };
      
      this.selectedCourse.lessons.push(newLesson);
      this.newLessonTitle = '';
      this.newLessonDuration = 0;
    }
  }

  postAnnouncement(): void {
    if (this.selectedCourse && this.newAnnouncement.trim()) {
      const newAnnouncement: Announcement = {
        id: Date.now(),
        message: this.newAnnouncement.trim(),
        datePosted: new Date()
      };
      
      this.selectedCourse.announcements.push(newAnnouncement);
      this.newAnnouncement = '';
    }
  }

  // Logout Method
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
