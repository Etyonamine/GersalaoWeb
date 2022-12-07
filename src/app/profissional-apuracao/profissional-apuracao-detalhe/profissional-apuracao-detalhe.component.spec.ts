import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionalApuracaoDetalheComponent } from './profissional-apuracao-detalhe.component';

describe('ProfissionalApuracaoDetalheComponent', () => {
  let component: ProfissionalApuracaoDetalheComponent;
  let fixture: ComponentFixture<ProfissionalApuracaoDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfissionalApuracaoDetalheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalApuracaoDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
