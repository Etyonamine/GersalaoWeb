import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServicoComponent } from './servico.component';

describe('ServicoComponent', () => {
  let component: ServicoComponent;
  let fixture: ComponentFixture<ServicoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
