import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteReportComponent } from './cliente-report.component';

describe('ClienteReportComponent', () => {
  let component: ClienteReportComponent;
  let fixture: ComponentFixture<ClienteReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
