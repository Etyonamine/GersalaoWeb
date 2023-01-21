import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaEstornoComponent } from './agenda-estorno.component';

describe('AgendaEstornoComponent', () => {
  let component: AgendaEstornoComponent;
  let fixture: ComponentFixture<AgendaEstornoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaEstornoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaEstornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
