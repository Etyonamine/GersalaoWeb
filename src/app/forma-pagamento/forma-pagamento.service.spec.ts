import { TestBed } from '@angular/core/testing';

import { FormaPagamentoService } from './forma-pagamento.service';

describe('FormaPagamenotService', () => {
  let service: FormaPagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormaPagamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
