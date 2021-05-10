import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicoFormComponent } from './servico-form.component';

describe('ServicoFormComponent', () => {
  let component: ServicoFormComponent;
  let fixture: ComponentFixture<ServicoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
