import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioAlterarSenhaComponent } from './usuario-alterar-senha.component';

describe('UsuarioAlterarSenhaComponent', () => {
  let component: UsuarioAlterarSenhaComponent;
  let fixture: ComponentFixture<UsuarioAlterarSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuarioAlterarSenhaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioAlterarSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
