import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCoachIncidentComponent } from './new-coach-incident.component';

describe('NewCoachIncidentComponent', () => {
  let component: NewCoachIncidentComponent;
  let fixture: ComponentFixture<NewCoachIncidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCoachIncidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCoachIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
