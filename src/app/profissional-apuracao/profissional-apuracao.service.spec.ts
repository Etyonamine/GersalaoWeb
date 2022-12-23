import { TestBed } from '@angular/core/testing';

import { ProfissionalApuracaoService } from './profissional-apuracao.service';

describe('ProfissionalApuracaoService', () => {
  let service: ProfissionalApuracaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalApuracaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
