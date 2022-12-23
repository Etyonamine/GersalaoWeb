import { TestBed } from '@angular/core/testing';

import { TipoContatoService } from './tipo-contato.service';

describe('TipoContatoService', () => {
  let service: TipoContatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoContatoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
