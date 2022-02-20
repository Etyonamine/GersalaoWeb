import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoBaixaPagtoComponent } from './pedido-baixa-pagto.component';

describe('PedidoBaixaPagtoComponent', () => {
  let component: PedidoBaixaPagtoComponent;
  let fixture: ComponentFixture<PedidoBaixaPagtoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidoBaixaPagtoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoBaixaPagtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
