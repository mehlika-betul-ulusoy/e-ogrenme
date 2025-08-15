import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearningPathsRoutingModule } from './learning-paths-routing.module';
import { LearningPathsComponent } from './learning-paths.component';


@NgModule({
  declarations: [
    LearningPathsComponent
  ],
  imports: [
    CommonModule,
    LearningPathsRoutingModule
  ]
})
export class LearningPathsModule { }
