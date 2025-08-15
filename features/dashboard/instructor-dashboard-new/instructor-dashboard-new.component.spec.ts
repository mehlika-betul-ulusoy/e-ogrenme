import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorDashboardNewComponent } from './instructor-dashboard-new.component';

describe('InstructorDashboardNewComponent', () => {
  let component: InstructorDashboardNewComponent;
  let fixture: ComponentFixture<InstructorDashboardNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorDashboardNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorDashboardNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
