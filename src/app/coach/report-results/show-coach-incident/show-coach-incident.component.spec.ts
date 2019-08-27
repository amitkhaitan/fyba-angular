import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCoachIncidentComponent } from './show-coach-incident.component';

describe('ShowCoachIncidentComponent', () => {
  let component: ShowCoachIncidentComponent;
  let fixture: ComponentFixture<ShowCoachIncidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCoachIncidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCoachIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
