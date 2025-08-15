import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.redirectToDashboard();
  }

  private redirectToDashboard(): void {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/home/login']);
      return;
    }

    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        this.router.navigate(['/dashboard/super-admin']);
        break;
      case UserRole.STUDENT:
        this.router.navigate(['/dashboard/student']);
        break;
      case UserRole.INSTRUCTOR:
        this.router.navigate(['/dashboard/instructor']);
        break;
      case UserRole.EDUCATION_MANAGER:
        this.router.navigate(['/dashboard/education-manager']);
        break;
      case UserRole.OBSERVER:
        this.router.navigate(['/dashboard/observer']);
        break;
      default:
        this.router.navigate(['/dashboard/student']);
    }
  }
}
