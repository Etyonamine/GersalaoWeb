import { TestBed } from '@angular/core/testing';

import { TipoProdutoService } from './tipo-produto.service';

describe('TipoProdutoService', () => {
  let service: TipoProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoProdutoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
