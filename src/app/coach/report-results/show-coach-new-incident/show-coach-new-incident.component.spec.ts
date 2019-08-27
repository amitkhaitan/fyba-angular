import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCoachNewIncidentComponent } from './show-coach-new-incident.component';

describe('ShowCoachNewIncidentComponent', () => {
  let component: ShowCoachNewIncidentComponent;
  let fixture: ComponentFixture<ShowCoachNewIncidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCoachNewIncidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCoachNewIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
