import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionalFinanceiroComponent } from './profissional-financeiro.component';

describe('ProfissionalFinanceiroComponent', () => {
  let component: ProfissionalFinanceiroComponent;
  let fixture: ComponentFixture<ProfissionalFinanceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfissionalFinanceiroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
