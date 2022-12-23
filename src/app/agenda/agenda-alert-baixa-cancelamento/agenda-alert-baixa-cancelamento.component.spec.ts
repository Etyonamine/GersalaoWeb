import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaAlertBaixaCancelamentoComponent } from './agenda-alert-baixa-cancelamento.component';

describe('AgendaAlertBaixaCancelamentoComponent', () => {
  let component: AgendaAlertBaixaCancelamentoComponent;
  let fixture: ComponentFixture<AgendaAlertBaixaCancelamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaAlertBaixaCancelamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaAlertBaixaCancelamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
