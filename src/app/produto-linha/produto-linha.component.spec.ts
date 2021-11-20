import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoLinhaComponent } from './produto-linha.component';

describe('ProdutoLinhaComponent', () => {
  let component: ProdutoLinhaComponent;
  let fixture: ComponentFixture<ProdutoLinhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutoLinhaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutoLinhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
