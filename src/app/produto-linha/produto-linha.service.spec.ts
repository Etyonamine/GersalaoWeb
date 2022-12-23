import { TestBed } from '@angular/core/testing';

import { ProdutoLinhaService } from './produto-linha.service';

describe('ProdutoLinhaService', () => {
  let service: ProdutoLinhaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdutoLinhaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
