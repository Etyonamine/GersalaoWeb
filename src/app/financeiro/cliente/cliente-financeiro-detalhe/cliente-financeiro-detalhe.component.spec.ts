import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteFinanceiroDetalheComponent } from './cliente-financeiro-detalhe.component';

describe('ClienteFinanceiroDetalheComponent', () => {
  let component: ClienteFinanceiroDetalheComponent;
  let fixture: ComponentFixture<ClienteFinanceiroDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteFinanceiroDetalheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteFinanceiroDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
