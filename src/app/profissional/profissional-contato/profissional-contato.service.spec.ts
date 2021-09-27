import { TestBed } from '@angular/core/testing';

import { ProfissionalContatoService } from './profissional-contato.service';

describe('ProfissionalContatoService', () => {
  let service: ProfissionalContatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalContatoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
