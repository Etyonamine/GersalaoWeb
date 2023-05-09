import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicoReportComponent } from './servico-report.component';

describe('ServicoReportComponent', () => {
  let component: ServicoReportComponent;
  let fixture: ComponentFixture<ServicoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicoReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
