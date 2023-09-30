import { TestBed } from '@angular/core/testing';

import { UsuarioPerfilMenuService } from './usuario-perfil-menu.service';

describe('UsuarioPerfilMenuService', () => {
  let service: UsuarioPerfilMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioPerfilMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
