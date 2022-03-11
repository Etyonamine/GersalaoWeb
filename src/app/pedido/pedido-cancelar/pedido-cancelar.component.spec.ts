import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoCancelarComponent } from './pedido-cancelar.component';

describe('PedidoCancelarComponent', () => {
  let component: PedidoCancelarComponent;
  let fixture: ComponentFixture<PedidoCancelarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidoCancelarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoCancelarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
