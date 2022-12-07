import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetSenhaAlterarComponent } from './reset-senha-alterar.component';

describe('ResetSenhaAlterarComponent', () => {
  let component: ResetSenhaAlterarComponent;
  let fixture: ComponentFixture<ResetSenhaAlterarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetSenhaAlterarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetSenhaAlterarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
