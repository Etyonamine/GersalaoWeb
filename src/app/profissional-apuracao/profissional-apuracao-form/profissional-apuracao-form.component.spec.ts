import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionalApuracaoFormComponent } from './profissional-apuracao-form.component';

describe('ProfissionalApuracaoFormComponent', () => {
  let component: ProfissionalApuracaoFormComponent;
  let fixture: ComponentFixture<ProfissionalApuracaoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfissionalApuracaoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalApuracaoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
