import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningPathsComponent } from './learning-paths.component';

const routes: Routes = [{ path: '', component: LearningPathsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearningPathsRoutingModule { }
