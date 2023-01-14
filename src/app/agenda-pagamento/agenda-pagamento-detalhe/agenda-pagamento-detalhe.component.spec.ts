import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaPagamentoDetalheComponent } from './agenda-pagamento-detalhe.component';

describe('AgendaPagamentoDetalheComponent', () => {
  let component: AgendaPagamentoDetalheComponent;
  let fixture: ComponentFixture<AgendaPagamentoDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaPagamentoDetalheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaPagamentoDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
