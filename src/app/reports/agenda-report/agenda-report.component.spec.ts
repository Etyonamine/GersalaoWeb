import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaReportComponent } from './agenda-report.component';

describe('AgendaReportComponent', () => {
  let component: AgendaReportComponent;
  let fixture: ComponentFixture<AgendaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
