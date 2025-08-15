import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

interface Course {
  id: string;
  title: string;
  icon: string;
  progress: number;
  lastAccess: string;
  duration: string;
  assignedBy: string; // Atayan kişi (eğitmen veya sistem)
  assignedDate: string; // Atanma tarihi
  deadline?: string; // Tamamlanma tarihi (isteğe bağlı)
  difficulty: 'Başlangıç' | 'Orta' | 'İleri';
  category: string; // Kategori
  isCompleted: boolean; // Tamamlanma durumu
}

interface LearningStep {
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface RecommendedCourse {
  title: string;
  description: string;
  reason: string;
  duration: string;
  difficulty: string;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Certificate {
  id: string;
  name: string;
  courseName: string;
  issueDate: string;
  downloadUrl: string;
  score: number;
}

interface StudyGoal {
  dailyTarget: number; // dakika cinsinden
  weeklyTarget: number;
  monthlyTarget: number;
}

interface StudySession {
  date: string;
  duration: number; // dakika cinsinden
  courseId?: string;
  courseName?: string;
}

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  currentUser: User | null = null;
  
  // Course filter state
  currentFilter: 'all' | 'active' | 'completed' | 'deadline' = 'all';
  
  // Daily Progress
  dailyProgress = 65;
  studyTime = 85; // bugünkü çalışma dakikası
  
  // Study Goals and Sessions
  studyGoals: StudyGoal = {
    dailyTarget: 120, // 2 saat/gün
    weeklyTarget: 840, // 14 saat/hafta
    monthlyTarget: 3600 // 60 saat/ay
  };

  // Bu haftaki çalışma oturumları
  weeklyStudySessions: StudySession[] = [
    { date: '2025-08-04', duration: 95, courseId: '1', courseName: 'Angular Temel Eğitimi' },
    { date: '2025-08-05', duration: 120, courseId: '2', courseName: 'TypeScript İleri Seviye' },
    { date: '2025-08-06', duration: 0 }, // dinlenme günü
    { date: '2025-08-07', duration: 150, courseId: '1', courseName: 'Angular Temel Eğitimi' },
    { date: '2025-08-08', duration: 110, courseId: '3', courseName: 'Proje Yönetimi' },
    { date: '2025-08-09', duration: 80, courseId: '2', courseName: 'TypeScript İleri Seviye' },
    { date: '2025-08-10', duration: 85, courseId: '1', courseName: 'Angular Temel Eğitimi' } // bugün
  ];

  // Toplam istatistikler
  totalStudyTime = 4800; // dakika (80 saat)
  totalCompletedCourses = 12;
  totalBadges = 8;
  currentStreak = 5; // ardışık gün sayısı
  
  // Assigned Courses
  assignedCourses: Course[] = [
    {
      id: '1',
      title: 'Angular Temel Eğitimi',
      icon: '🅰️',
      progress: 75,
      lastAccess: '2 saat önce',
      duration: '12 saat',
      assignedBy: 'Ahmet Öğretmen',
      assignedDate: '15 Temmuz 2025',
      deadline: '30 Ağustos 2025',
      difficulty: 'Başlangıç',
      category: 'Frontend Development',
      isCompleted: false
    },
    {
      id: '2',
      title: 'TypeScript İleri Seviye',
      icon: '💪',
      progress: 45,
      lastAccess: '1 gün önce',
      duration: '8 saat',
      assignedBy: 'Fatma Yıldız',
      assignedDate: '20 Temmuz 2025',
      deadline: '15 Eylül 2025',
      difficulty: 'İleri',
      category: 'Programming',
      isCompleted: false
    },
    {
      id: '3',
      title: 'Proje Yönetimi',
      icon: '📊',
      progress: 90,
      lastAccess: '3 gün önce',
      duration: '6 saat',
      assignedBy: 'Sistem',
      assignedDate: '10 Temmuz 2025',
      difficulty: 'Orta',
      category: 'Management',
      isCompleted: false
    },
    {
      id: '4',
      title: 'JavaScript ES6+',
      icon: '⚡',
      progress: 100,
      lastAccess: '1 hafta önce',
      duration: '10 saat',
      assignedBy: 'Mehmet Demir',
      assignedDate: '1 Temmuz 2025',
      difficulty: 'Orta',
      category: 'Programming',
      isCompleted: true
    }
  ];

  // Learning Path
  learningPath: LearningStep[] = [
    {
      title: 'Temel Kavramlar',
      description: 'HTML, CSS, JavaScript temelleri',
      completed: true,
      current: false
    },
    {
      title: 'Framework Giriş',
      description: 'Angular fundamentals',
      completed: true,
      current: false
    },
    {
      title: 'İleri Konular',
      description: 'Components, Services, Routing',
      completed: false,
      current: true
    },
    {
      title: 'Proje Geliştirme',
      description: 'Gerçek proje üzerinde çalışma',
      completed: false,
      current: false
    }
  ];

  // Recommended Courses
  recommendedCourses: RecommendedCourse[] = [
    {
      title: 'Node.js Backend',
      description: 'API geliştirme ve database işlemleri',
      reason: 'İlgi Alanına Göre',
      duration: '10 saat',
      difficulty: 'Orta'
    },
    {
      title: 'UI/UX Tasarım',
      description: 'Kullanıcı deneyimi tasarım prensipleri',
      reason: 'Performansa Göre',
      duration: '6 saat',
      difficulty: 'Başlangıç'
    }
  ];

  // Recent Badges
  recentBadges: Badge[] = [
    { 
      id: 'badge1',
      name: 'İlk Kurs Tamamlama', 
      icon: '🏆',
      description: 'İlk kursunuzu başarıyla tamamladınız!',
      earnedDate: '5 Ağustos 2025',
      rarity: 'common'
    },
    { 
      id: 'badge2',
      name: '7 Gün Aktif', 
      icon: '🔥',
      description: '7 gün boyunca aktif kalarak öğrenmeye devam ettiniz',
      earnedDate: '8 Ağustos 2025',
      rarity: 'rare'
    },
    { 
      id: 'badge3',
      name: 'Quiz Ustası', 
      icon: '🧠',
      description: '5 quiz\'de %90 üzeri puan aldınız',
      earnedDate: '10 Ağustos 2025',
      rarity: 'epic'
    }
  ];

  // Certificates
  certificates: Certificate[] = [
    { 
      id: 'cert1',
      name: 'JavaScript Fundamentals',
      courseName: 'JavaScript ES6+ Kursu',
      issueDate: '1 Ağustos 2025',
      downloadUrl: '/certificates/js-fundamentals.pdf',
      score: 95
    },
    { 
      id: 'cert2',
      name: 'CSS Advanced Techniques',
      courseName: 'CSS İleri Teknikleri',
      issueDate: '25 Temmuz 2025',
      downloadUrl: '/certificates/css-advanced.pdf',
      score: 88
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  // Assigned Courses Methods
  getActiveAssignedCourses(): Course[] {
    return this.assignedCourses.filter(course => !course.isCompleted);
  }

  getCompletedAssignedCourses(): Course[] {
    return this.assignedCourses.filter(course => course.isCompleted);
  }

  getAssignedCoursesCount(): number {
    return this.assignedCourses.length;
  }

  getActiveAssignedCoursesCount(): number {
    return this.getActiveAssignedCourses().length;
  }

  getCompletedAssignedCoursesCount(): number {
    return this.getCompletedAssignedCourses().length;
  }

  getCoursesByAssigner(assignerName: string): Course[] {
    return this.assignedCourses.filter(course => course.assignedBy === assignerName);
  }

  getCoursesByDifficulty(difficulty: string): Course[] {
    return this.assignedCourses.filter(course => course.difficulty === difficulty);
  }

  getCoursesByCategory(category: string): Course[] {
    return this.assignedCourses.filter(course => course.category === category);
  }

  getCoursesWithDeadline(): Course[] {
    return this.assignedCourses.filter(course => course.deadline);
  }

  startCourse(courseId: string): void {
    console.log(`Kurs başlatılıyor: ${courseId}`);
    // Kursa başlama logic'i
  }

  viewCourseDetails(courseId: string): void {
    console.log(`Kurs detayları görüntüleniyor: ${courseId}`);
    // Kurs detayları sayfasına yönlendirme
  }

  markCourseAsCompleted(courseId: string): void {
    const course = this.assignedCourses.find(c => c.id === courseId);
    if (course) {
      course.isCompleted = true;
      course.progress = 100;
      console.log(`Kurs tamamlandı olarak işaretlendi: ${course.title}`);
    }
  }

  // Filter methods for assigned courses
  setFilter(filter: 'all' | 'active' | 'completed' | 'deadline'): void {
    this.currentFilter = filter;
  }

  getFilteredCourses(): Course[] {
    switch (this.currentFilter) {
      case 'active':
        return this.getActiveAssignedCourses();
      case 'completed':
        return this.getCompletedAssignedCourses();
      case 'deadline':
        return this.getCoursesWithDeadline().filter(course => !course.isCompleted);
      default:
        return this.assignedCourses;
    }
  }

  isFilterActive(filter: string): boolean {
    return this.currentFilter === filter;
  }

  // Navigation methods
  goToCourses(): void {
    this.router.navigate(['/courses']);
  }

  goToQuizzes(): void {
    this.router.navigate(['/quizzes']);
  }

  goToCalendar(): void {
    this.router.navigate(['/calendar']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  // Logout method
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);

  }

  // Study Time and Goals Methods
  getTodayStudyTime(): number {
    const today = new Date().toISOString().split('T')[0];
    const todaySession = this.weeklyStudySessions.find(session => session.date === today);
    return todaySession ? todaySession.duration : 0;
  }

  getWeeklyStudyTime(): number {
    return this.weeklyStudySessions.reduce((total, session) => total + session.duration, 0);
  }

  getDailyProgressPercentage(): number {
    const todayTime = this.getTodayStudyTime();
    return Math.min(100, (todayTime / this.studyGoals.dailyTarget) * 100);
  }

  getWeeklyProgressPercentage(): number {
    const weeklyTime = this.getWeeklyStudyTime();
    return Math.min(100, (weeklyTime / this.studyGoals.weeklyTarget) * 100);
  }

  formatStudyTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}s ${mins}dk`;
    }
    return `${mins}dk`;
  }

  getDailyGoalStatus(): 'completed' | 'almost' | 'progress' | 'none' {
    const progress = this.getDailyProgressPercentage();
    if (progress >= 100) return 'completed';
    if (progress >= 80) return 'almost';
    if (progress >= 30) return 'progress';
    return 'none';
  }

  // Badge and Certificate Methods
  downloadCertificate(certificate: Certificate): void {
    console.log(`Sertifika indiriliyor: ${certificate.name}`);
    // Sertifika indirme logic'i
    window.open(certificate.downloadUrl, '_blank');
  }

  getBadgeRarityClass(rarity: string): string {
    return `badge-${rarity}`;
  }

  // Learning Path Methods
  moveToNextStep(): void {
    const currentIndex = this.learningPath.findIndex(step => step.current);
    if (currentIndex >= 0 && currentIndex < this.learningPath.length - 1) {
      this.learningPath[currentIndex].current = false;
      this.learningPath[currentIndex].completed = true;
      this.learningPath[currentIndex + 1].current = true;
    }
  }

  getCompletedStepsCount(): number {
    return this.learningPath.filter(step => step.completed).length;
  }

  getLearningPathProgress(): number {
    return (this.getCompletedStepsCount() / this.learningPath.length) * 100;
  }

  // Recommended Courses Methods
  enrollRecommendedCourse(course: RecommendedCourse): void {
    console.log(`Önerilen kursa kayıt: ${course.title}`);
    // Kursa kayıt logic'i
  }

  dismissRecommendation(course: RecommendedCourse): void {
    const index = this.recommendedCourses.indexOf(course);
    if (index > -1) {
      this.recommendedCourses.splice(index, 1);
    }
  }

  // Calendar event handlers - Tip hataları düzeltildi
  onCalendarEventClick(event: any): void {
    console.log('Etkinlik tıklandı:', event);
    // Etkinlik detaylarını göster veya ilgili sayfaya yönlendir
  }

  onCalendarDateClick(date: Date | Event): void {
    // Event'ten date bilgisini çıkar
    let selectedDate: Date;
    
    if (date instanceof Date) {
      selectedDate = date;
    } else {
      // Event objesi ise, calendar component'ten gelen Date'i al
      selectedDate = new Date();
    }
    
    console.log('Tarih seçildi:', selectedDate);
    // Seçilen tarihe göre işlem yap
    this.handleDateSelection(selectedDate);
  }

  private handleDateSelection(date: Date): void {
    // Seçilen tarihe göre görevleri filtrele veya etkinlikleri göster
    console.log('Seçilen tarih işleniyor:', date.toLocaleDateString('tr-TR'));
  }
}
