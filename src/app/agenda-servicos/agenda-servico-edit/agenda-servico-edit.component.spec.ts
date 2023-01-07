import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaServicoEditComponent } from './agenda-servico-edit.component';

describe('AgendaServicoEditComponent', () => {
  let component: AgendaServicoEditComponent;
  let fixture: ComponentFixture<AgendaServicoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaServicoEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaServicoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
