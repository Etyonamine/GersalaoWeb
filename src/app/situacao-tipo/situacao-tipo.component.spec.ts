import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SituacaoTipoComponent } from './situacao-tipo.component';

describe('SituacaoTipoComponent', () => {
  let component: SituacaoTipoComponent;
  let fixture: ComponentFixture<SituacaoTipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SituacaoTipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SituacaoTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
