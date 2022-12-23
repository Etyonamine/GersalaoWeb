import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContatoFormComponent } from './contato-form.component';

describe('ContatoFormComponent', () => {
  let component: ContatoFormComponent;
  let fixture: ComponentFixture<ContatoFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContatoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContatoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
