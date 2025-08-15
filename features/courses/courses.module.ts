import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';
import { CourseManagementComponent } from './course-management/course-management.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    CoursesComponent,
    CourseManagementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CoursesRoutingModule,
    SharedModule
  ]
})
export class CoursesModule { }
