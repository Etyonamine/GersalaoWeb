import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoProdutoDialogoComponent } from './tipo-produto-dialogo.component';

describe('TipoProdutoDialogoComponent', () => {
  let component: TipoProdutoDialogoComponent;
  let fixture: ComponentFixture<TipoProdutoDialogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoProdutoDialogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoProdutoDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
