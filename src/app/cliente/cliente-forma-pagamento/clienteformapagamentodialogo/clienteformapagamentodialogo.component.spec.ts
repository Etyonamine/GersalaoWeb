import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteformapagamentodialogoComponent } from './clienteformapagamentodialogo.component';

describe('ClienteformapagamentodialogoComponent', () => {
  let component: ClienteformapagamentodialogoComponent;
  let fixture: ComponentFixture<ClienteformapagamentodialogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteformapagamentodialogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteformapagamentodialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
