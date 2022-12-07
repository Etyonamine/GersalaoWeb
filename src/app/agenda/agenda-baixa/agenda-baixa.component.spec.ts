import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaBaixaComponent } from './agenda-baixa.component';

describe('AgendaBaixaComponent', () => {
  let component: AgendaBaixaComponent;
  let fixture: ComponentFixture<AgendaBaixaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaBaixaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaBaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
