import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import { OrganizationService } from './services/organization.service';
import { CourseService } from './services/course.service';
import { UserService } from './services/user.service';
import { StorageService } from './services/storage.service';
import { NotificationService } from './services/notification.service';
import { AnalyticsService } from './services/analytics.service';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    OrganizationService,
    CourseService,
    UserService,
    StorageService,
    NotificationService,
    AnalyticsService,
    AuthGuard,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CoreModule { }
