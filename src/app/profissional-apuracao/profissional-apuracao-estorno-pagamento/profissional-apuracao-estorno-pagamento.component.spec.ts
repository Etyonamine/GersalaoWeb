import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionalApuracaoEstornoPagamentoComponent } from './profissional-apuracao-estorno-pagamento.component';

describe('ProfissionalApuracaoEstornoPagamentoComponent', () => {
  let component: ProfissionalApuracaoEstornoPagamentoComponent;
  let fixture: ComponentFixture<ProfissionalApuracaoEstornoPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfissionalApuracaoEstornoPagamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalApuracaoEstornoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
