import { TestBed } from '@angular/core/testing';

import { AgendaPagamentoDetalheService } from './agenda-pagamento-detalhe.service';

describe('AgendaPagamentoDetalheService', () => {
  let service: AgendaPagamentoDetalheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaPagamentoDetalheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
