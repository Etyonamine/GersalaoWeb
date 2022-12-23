import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueDetalheComponent } from './estoque-detalhe.component';

describe('EstoqueDetalheComponent', () => {
  let component: EstoqueDetalheComponent;
  let fixture: ComponentFixture<EstoqueDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstoqueDetalheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstoqueDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
