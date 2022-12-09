import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaCancelamentoComponent } from './agenda-cancelamento.component';

describe('AgendaCancelamentoComponent', () => {
  let component: AgendaCancelamentoComponent;
  let fixture: ComponentFixture<AgendaCancelamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaCancelamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaCancelamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
