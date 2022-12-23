import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaServicosComponent } from './agenda-servicos.component';

describe('AgendaServicosComponent', () => {
  let component: AgendaServicosComponent;
  let fixture: ComponentFixture<AgendaServicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaServicosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
