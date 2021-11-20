import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoLinhaEditDialogComponent } from './produto-linha-edit-dialog.component';

describe('ProdutoLinhaEditDialogComponent', () => {
  let component: ProdutoLinhaEditDialogComponent;
  let fixture: ComponentFixture<ProdutoLinhaEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutoLinhaEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutoLinhaEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
