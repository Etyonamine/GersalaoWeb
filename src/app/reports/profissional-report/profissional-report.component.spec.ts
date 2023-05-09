import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionalReportComponent } from './profissional-report.component';

describe('ProfissionalReportComponent', () => {
  let component: ProfissionalReportComponent;
  let fixture: ComponentFixture<ProfissionalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfissionalReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
