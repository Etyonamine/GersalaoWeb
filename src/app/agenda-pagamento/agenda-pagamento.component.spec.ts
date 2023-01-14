import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaPagamentoComponent } from './agenda-pagamento.component';

describe('AgendaPagamentoComponent', () => {
  let component: AgendaPagamentoComponent;
  let fixture: ComponentFixture<AgendaPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaPagamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
