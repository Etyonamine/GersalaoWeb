import { TestBed } from '@angular/core/testing';

import { ProfissionalTipoServicoService } from './profissional-tipo-servico.service';

describe('ProfissionalTipoServicoService', () => {
  let service: ProfissionalTipoServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalTipoServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
