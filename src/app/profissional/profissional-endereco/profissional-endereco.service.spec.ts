import { TestBed } from '@angular/core/testing';

import { ProfissionalEnderecoService } from './profissional-endereco.service';

describe('ProfissionalEnderecoService', () => {
  let service: ProfissionalEnderecoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalEnderecoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
