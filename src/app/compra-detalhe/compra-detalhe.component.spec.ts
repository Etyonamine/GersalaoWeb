import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraDetalheComponent } from './compra-detalhe.component';

describe('CompraDetalheComponent', () => {
  let component: CompraDetalheComponent;
  let fixture: ComponentFixture<CompraDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraDetalheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
