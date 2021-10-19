import { TestBed } from '@angular/core/testing';

import { ProfissionalServicoService } from './profissional-servico.service';

describe('ProfissionalServicoService', () => {
  let service: ProfissionalServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
