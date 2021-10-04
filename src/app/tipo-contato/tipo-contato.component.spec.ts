import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoContatoComponent } from './tipo-contato.component';

describe('TipoContatoComponent', () => {
  let component: TipoContatoComponent;
  let fixture: ComponentFixture<TipoContatoComponent>;

  beforeEach(async(() => {
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
