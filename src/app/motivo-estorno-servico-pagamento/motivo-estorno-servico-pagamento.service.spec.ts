import { TestBed } from '@angular/core/testing';

import { MotivoEstornoServicoPagamentoService } from './motivo-estorno-servico-pagamento.service';

describe('MotivoEstornoServicoPagamentoService', () => {
  let service: MotivoEstornoServicoPagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotivoEstornoServicoPagamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
