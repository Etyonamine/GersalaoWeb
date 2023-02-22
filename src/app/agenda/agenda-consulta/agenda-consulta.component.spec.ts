import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaConsultaComponent } from './agenda-consulta.component';

describe('AgendaConsultaComponent', () => {
  let component: AgendaConsultaComponent;
  let fixture: ComponentFixture<AgendaConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaConsultaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
