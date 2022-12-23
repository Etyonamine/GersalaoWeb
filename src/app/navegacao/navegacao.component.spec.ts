import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavegacaoComponent } from './navegacao.component';

describe('NavegacaoComponent', () => {
  let component: NavegacaoComponent;
  let fixture: ComponentFixture<NavegacaoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavegacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavegacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
