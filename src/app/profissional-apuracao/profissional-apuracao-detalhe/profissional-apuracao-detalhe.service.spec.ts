import { TestBed } from '@angular/core/testing';

import { ProfissionalApuracaoDetalheService } from './profissional-apuracao-detalhe.service';

describe('ProfissionalApuracaoDetalheService', () => {
  let service: ProfissionalApuracaoDetalheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalApuracaoDetalheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
