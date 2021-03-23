import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadeFederativaComponent } from './unidade-federativa.component';

describe('UnidadeFederativaComponent', () => {
  let component: UnidadeFederativaComponent;
  let fixture: ComponentFixture<UnidadeFederativaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnidadeFederativaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadeFederativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
