import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteFinanceiroComponent } from './cliente-financeiro.component';

describe('ClienteFinanceiroComponent', () => {
  let component: ClienteFinanceiroComponent;
  let fixture: ComponentFixture<ClienteFinanceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteFinanceiroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
