import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaixaLancamentoManualComponent } from './caixa-lancamento-manual.component';

describe('CaixaLancamentoManualComponent', () => {
  let component: CaixaLancamentoManualComponent;
  let fixture: ComponentFixture<CaixaLancamentoManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaixaLancamentoManualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaixaLancamentoManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
