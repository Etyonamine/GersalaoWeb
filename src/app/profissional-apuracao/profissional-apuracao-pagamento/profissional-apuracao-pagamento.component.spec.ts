import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionalApuracaoPagamentoComponent } from './profissional-apuracao-pagamento.component';

describe('ProfissionalApuracaoPagamentoComponent', () => {
  let component: ProfissionalApuracaoPagamentoComponent;
  let fixture: ComponentFixture<ProfissionalApuracaoPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfissionalApuracaoPagamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalApuracaoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
