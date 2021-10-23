import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionalTipoServicoComponent } from './profissional-tipo-servico.component';

describe('ProfissionalTipoServicoComponent', () => {
  let component: ProfissionalTipoServicoComponent;
  let fixture: ComponentFixture<ProfissionalTipoServicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfissionalTipoServicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalTipoServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
