import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfissionalComponent } from './profissional.component';

describe('ProfissionalComponent', () => {
  let component: ProfissionalComponent;
  let fixture: ComponentFixture<ProfissionalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfissionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
