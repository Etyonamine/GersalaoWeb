import { TestBed } from '@angular/core/testing';

import { ProfissionalApuracaoPagamentoService } from './profissional-apuracao-pagamento.service';

describe('ProfissionalApuracaoPagamentoService', () => {
  let service: ProfissionalApuracaoPagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalApuracaoPagamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
