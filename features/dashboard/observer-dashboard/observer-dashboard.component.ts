import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-observer-dashboard',
  templateUrl: './observer-dashboard.component.html',
  styleUrls: ['./observer-dashboard.component.scss']
})
export class ObserverDashboardComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // Logout Method
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
