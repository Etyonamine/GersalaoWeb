import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionalFormComponent } from './profissional-form.component';

describe('ProfissionalFormComponent', () => {
  let component: ProfissionalFormComponent;
  let fixture: ComponentFixture<ProfissionalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfissionalFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
