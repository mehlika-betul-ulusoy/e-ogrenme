import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { EducationManagerDashboardComponent } from './education-manager-dashboard/education-manager-dashboard.component';
import { ObserverDashboardComponent } from './observer-dashboard/observer-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { InstructorDashboardNewComponent } from './instructor-dashboard-new/instructor-dashboard-new.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';


@NgModule({
  declarations: [
    DashboardComponent,
    StudentDashboardComponent,
    InstructorDashboardComponent,
    EducationManagerDashboardComponent,
    ObserverDashboardComponent,
    InstructorDashboardNewComponent,
    SuperAdminDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    SharedModule
  ],
  providers: [
    DatePipe,
    DecimalPipe
  ]
})
export class DashboardModule { }
