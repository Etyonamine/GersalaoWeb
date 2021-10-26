import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipoContatoComponent } from './tipo-contato.component';

describe('TipoContatoComponent', () => {
  let component: TipoContatoComponent;
  let fixture: ComponentFixture<TipoContatoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoContatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoContatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
