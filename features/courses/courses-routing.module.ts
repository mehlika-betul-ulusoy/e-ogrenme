import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses.component';
import { CourseManagementComponent } from './course-management/course-management.component';

const routes: Routes = [
  { path: '', component: CoursesComponent },
  { path: 'management', component: CourseManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
