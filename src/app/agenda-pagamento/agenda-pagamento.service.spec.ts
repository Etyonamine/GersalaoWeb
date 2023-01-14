import { TestBed } from '@angular/core/testing';

import { AgendaPagamentoService } from './agenda-pagamento.service';

describe('AgendaPagamentoService', () => {
  let service: AgendaPagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaPagamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
