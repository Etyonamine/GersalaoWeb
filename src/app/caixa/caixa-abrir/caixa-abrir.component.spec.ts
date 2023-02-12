import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaixaAbrirComponent } from './caixa-abrir.component';

describe('CaixaAbrirComponent', () => {
  let component: CaixaAbrirComponent;
  let fixture: ComponentFixture<CaixaAbrirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaixaAbrirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaixaAbrirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
