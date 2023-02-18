import { TestBed } from '@angular/core/testing';

import { CaixaTipoLancamentoService } from './caixa-tipo-lancamento.service';

describe('CaixaTipoLancamentoService', () => {
  let service: CaixaTipoLancamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaixaTipoLancamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
