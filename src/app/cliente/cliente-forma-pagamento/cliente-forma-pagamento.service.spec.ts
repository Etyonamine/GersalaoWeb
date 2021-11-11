import { TestBed } from '@angular/core/testing';

import { ClienteFormaPagamentoService } from './cliente-forma-pagamento.service';

describe('ClienteFormaPagamentoService', () => {
  let service: ClienteFormaPagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteFormaPagamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
