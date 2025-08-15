import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { EducationManagerDashboardComponent } from './education-manager-dashboard/education-manager-dashboard.component';
import { ObserverDashboardComponent } from './observer-dashboard/observer-dashboard.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/user.model';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student',
    component: StudentDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      roles: [UserRole.STUDENT],
      dashboardType: 'student'
    }
  },
  {
    path: 'education-manager',
    component: EducationManagerDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      roles: [UserRole.EDUCATION_MANAGER],
      dashboardType: 'education-manager'
    }
  },
  {
    path: 'instructor',
    component: InstructorDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      roles: [UserRole.INSTRUCTOR],
      dashboardType: 'instructor'
    }
  },
  {
    path: 'observer',
    component: ObserverDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      roles: [UserRole.OBSERVER],
      dashboardType: 'observer'
    }
  },
  {
    path: 'super-admin',
    component: SuperAdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      roles: [UserRole.SUPER_ADMIN],
      dashboardType: 'super-admin'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
