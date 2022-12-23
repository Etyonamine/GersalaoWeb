import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteFormaPagamentoComponent } from './cliente-forma-pagamento.component';

describe('ClienteFormaPagamentoComponent', () => {
  let component: ClienteFormaPagamentoComponent;
  let fixture: ComponentFixture<ClienteFormaPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteFormaPagamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteFormaPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
