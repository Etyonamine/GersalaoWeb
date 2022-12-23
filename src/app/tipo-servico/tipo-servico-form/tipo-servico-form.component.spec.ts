import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipoServicoFormComponent } from './tipo-servico-form.component';

describe('TipoServicoFormComponent', () => {
  let component: TipoServicoFormComponent;
  let fixture: ComponentFixture<TipoServicoFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoServicoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoServicoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
