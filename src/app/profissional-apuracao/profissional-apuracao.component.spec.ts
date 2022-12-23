import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionalApuracaoComponent } from './profissional-apuracao.component';

describe('ProfissionalApuracaoComponent', () => {
  let component: ProfissionalApuracaoComponent;
  let fixture: ComponentFixture<ProfissionalApuracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfissionalApuracaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalApuracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
