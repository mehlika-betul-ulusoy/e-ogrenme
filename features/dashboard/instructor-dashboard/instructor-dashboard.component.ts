import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface Course {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  subLessons: SubLesson[];
  quizzes: Quiz[];
  files: FileResource[];
}

interface SubLesson {
  id: number;
  title: string;
  content: string;
  duration: string;
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
  timeLimit: number;
  passingScore: number;
  maxScore: number;
  results: QuizResult[];
}

interface QuizResult {
  studentName: string;
  score: number;
  date: Date;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Student {
  id: number;
  name: string;
  email: string;
  progress: StudentProgress[];
}

interface StudentProgress {
  courseId: number;
  lessonId: number;
  completionPercentage: number;
  lastAccessed: Date;
  quizScores: QuizScore[];
}

interface QuizScore {
  quizId: number;
  score: number;
  completedAt: Date;
}

interface Comment {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  lessonId: number;
  question: string;
  dateAsked: Date;
  reply?: string;
  replyDate?: Date;
}

interface FileResource {
  id: number;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'announcement' | 'reminder' | 'assignment' | 'general';
  courseId?: number;
  targetStudents: number[];
  sentDate: Date;
  isRead: boolean;
}

interface NotificationTemplate {
  type: 'announcement' | 'reminder' | 'assignment' | 'general';
  title: string;
  defaultMessage: string;
}

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['../instructor-dashboard-new/instructor-dashboard-new.component.scss']
})
export class InstructorDashboardComponent implements OnInit {

  courses: Course[] = [];
  
  comments: Comment[] = [];

  // Notification properties
  notifications: Notification[] = [];
  notificationForm: FormGroup;
  selectedStudents: number[] = [];
  notificationTemplates: NotificationTemplate[] = [
    {
      type: 'announcement',
      title: 'Önemli Duyuru',
      defaultMessage: 'Sayın öğrenciler, aşağıdaki duyuruyu dikkatinize sunuyorum:'
    },
    {
      type: 'reminder',
      title: 'Hatırlatma',
      defaultMessage: 'Lütfen şu konuları unutmayınız:'
    },
    {
      type: 'assignment',
      title: 'Ödev Duyurusu',
      defaultMessage: 'Yeni bir ödev verilmiştir. Detaylar aşağıdadır:'
    },
    {
      type: 'general',
      title: 'Genel Bilgi',
      defaultMessage: 'Bilginize sunulur:'
    }
  ];

  // Form controls
  courseForm: FormGroup;
  lessonForm: FormGroup;
  quizForm: FormGroup;
  
  selectedCourse: Course | null = null;
  selectedLesson: Lesson | null = null;
  selectedQuiz: Quiz | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.lessonForm = this.fb.group({
      title: ['', Validators.required],
      duration: ['', Validators.required]
    });

    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      timeLimit: ['', Validators.required],
      passingScore: ['', Validators.required]
    });

    this.notificationForm = this.fb.group({
      type: ['announcement', Validators.required],
      title: ['', Validators.required],
      message: ['', Validators.required],
      courseId: [''],
      targetAll: [false]
    });
  }

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData() {
    // Mock courses data
    this.courses = [
      {
        id: 1,
        title: 'Angular Temelleri',
        description: 'Angular framework\'ün temel kavramları',
        lessons: [
          {
            id: 1,
            title: 'Component Yapısı',
            duration: '45 dk',
            subLessons: [],
            quizzes: [],
            files: []
          }
        ]
      }
    ];

    // Mock comments
    this.comments = [
      {
        id: 1,
        studentId: 1,
        studentName: 'Ahmet Yılmaz',
        courseId: 1,
        lessonId: 1,
        question: 'Component lifecycle hakkında daha fazla bilgi alabilir miyim?',
        dateAsked: new Date()
      }
    ];
  }

  // Kurs işlemleri
  addCourse() {
    if (this.courseForm.valid) {
      const newCourse: Course = {
        id: this.courses.length + 1,
        title: this.courseForm.value.title,
        description: this.courseForm.value.description,
        lessons: []
      };
      this.courses.push(newCourse);
      this.courseForm.reset();
    }
  }

  selectCourse(course: Course) {
    this.selectedCourse = course;
    this.selectedLesson = null;
    this.selectedQuiz = null;
  }

  selectLesson(lesson: Lesson) {
    this.selectedLesson = lesson;
    this.selectedQuiz = null;
  }

  // Alt ders işlemleri
  addSubLesson(courseId: number, lessonId: number) {
    const course = this.courses.find(c => c.id === courseId);
    const lesson = course?.lessons.find(l => l.id === lessonId);
    if (lesson) {
      const title = prompt('Alt ders başlığı:');
      const content = prompt('Alt ders içeriği:');
      const duration = prompt('Süre (dk):');
      
      if (title && content && duration) {
        const newSubLesson: SubLesson = {
          id: lesson.subLessons.length + 1,
          title,
          content,
          duration
        };
        lesson.subLessons.push(newSubLesson);
      }
    }
  }

  // Ders ekleme (courseId ile)
  addLesson(courseId: number) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      const title = prompt('Ders başlığı:');
      const duration = prompt('Süre (dk):');
      
      if (title && duration) {
        const newLesson: Lesson = {
          id: course.lessons.length + 1,
          title,
          duration,
          subLessons: [],
          quizzes: [],
          files: []
        };
        course.lessons.push(newLesson);
      }
    }
  }

  // Quiz ekleme (courseId ve lessonId ile)
  addQuiz(courseId: number, lessonId: number) {
    const course = this.courses.find(c => c.id === courseId);
    const lesson = course?.lessons.find(l => l.id === lessonId);
    if (lesson) {
      const title = prompt('Quiz başlığı:');
      const timeLimit = prompt('Süre limiti (dk):');
      const passingScore = prompt('Geçme puanı:');
      
      if (title && timeLimit && passingScore) {
        const newQuiz: Quiz = {
          id: lesson.quizzes.length + 1,
          title,
          timeLimit: parseInt(timeLimit),
          passingScore: parseInt(passingScore),
          questions: [],
          maxScore: 100,
          results: []
        };
        lesson.quizzes.push(newQuiz);
      }
    }
  }

  // Dosya ekleme (courseId ve lessonId ile)
  addFileFromForm(courseId: number, lessonId: number, fileName: string, fileType: string) {
    const course = this.courses.find(c => c.id === courseId);
    const lesson = course?.lessons.find(l => l.id === lessonId);
    if (lesson && fileName) {
      const newFile: FileResource = {
        id: lesson.files.length + 1,
        name: fileName,
        type: fileType,
        size: 0,
        url: '#'
      };
      lesson.files.push(newFile);
    }
  }

  selectQuiz(quiz: Quiz) {
    this.selectedQuiz = quiz;
  }

  // Soru ekleme
  addQuestion(quizId: number, text: string, options: string[], correctAnswer: number) {
    const quiz = this.selectedLesson?.quizzes.find(q => q.id === quizId);
    if (quiz) {
      const newQuestion: Question = {
        id: quiz.questions.length + 1,
        text,
        options,
        correctAnswer
      };
      quiz.questions.push(newQuestion);
    }
  }

  // Yorum / soru cevap işlemleri
  replyToComment(commentId: number, replyText: string) {
    if (!replyText?.trim()) return;

    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return;

    comment.reply = replyText.trim();
    comment.replyDate = new Date();
  }

  // Notification Methods
  onNotificationTypeChange() {
    const selectedType = this.notificationForm.get('type')?.value;
    const template = this.notificationTemplates.find(t => t.type === selectedType);
    
    if (template) {
      this.notificationForm.patchValue({
        title: template.title,
        message: template.defaultMessage
      });
    }
  }

  toggleStudentSelection(studentId: number) {
    const index = this.selectedStudents.indexOf(studentId);
    if (index > -1) {
      this.selectedStudents.splice(index, 1);
    } else {
      this.selectedStudents.push(studentId);
    }
  }

  selectAllStudents() {
    // Tüm kurslardaki öğrencileri seç (mock data için basit implementasyon)
    this.selectedStudents = [1, 2, 3, 4, 5, 6]; // Mock student IDs
  }

  clearStudentSelection() {
    this.selectedStudents = [];
  }

  getStudentsByCourse(courseId: number): Student[] {
    // Mock data - gerçek uygulamada service'ten gelecek
    return [
      { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', progress: [] },
      { id: 2, name: 'Ayşe Demir', email: 'ayse@example.com', progress: [] },
      { id: 3, name: 'Mehmet Kaya', email: 'mehmet@example.com', progress: [] }
    ];
  }

  sendNotification() {
    if (this.notificationForm.invalid || this.selectedStudents.length === 0) {
      alert('Lütfen formu doldurun ve en az bir öğrenci seçin.');
      return;
    }

    const formData = this.notificationForm.value;
    const targetAll = formData.targetAll;
    
    const notification: Notification = {
      id: Date.now(),
      title: formData.title,
      message: formData.message,
      type: formData.type,
      courseId: formData.courseId || undefined,
      targetStudents: targetAll ? this.getAllStudentIds() : [...this.selectedStudents],
      sentDate: new Date(),
      isRead: false
    };

    this.notifications.unshift(notification);
    
    // Form'u temizle
    this.notificationForm.reset({
      type: 'announcement',
      title: '',
      message: '',
      courseId: '',
      targetAll: false
    });
    this.selectedStudents = [];
    
    alert(`Bildirim ${notification.targetStudents.length} öğrenciye gönderildi!`);
  }

  getAllStudentIds(): number[] {
    // Mock data - gerçek uygulamada tüm öğrenci ID'lerini döndürecek
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  deleteNotification(notificationId: number) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  getNotificationTypeIcon(type: string): string {
    switch (type) {
      case 'announcement': return '📢';
      case 'reminder': return '⏰';
      case 'assignment': return '📝';
      case 'general': return '📋';
      default: return '📄';
    }
  }

  // Logout Method
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
