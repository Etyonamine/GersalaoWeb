import { TestBed } from '@angular/core/testing';

import { CompraDetalheService } from './compra-detalhe.service';

describe('CompraDetalheService', () => {
  let service: CompraDetalheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompraDetalheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
