import { TestBed } from '@angular/core/testing';

import { AgendaServicoPagamentoEstornoService } from './agenda-servico-pagamento-estorno.service';

describe('AgendaServicoPagamentoEstornoService', () => {
  let service: AgendaServicoPagamentoEstornoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaServicoPagamentoEstornoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
