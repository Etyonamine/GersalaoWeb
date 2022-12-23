import { TestBed } from '@angular/core/testing';

import { ProfissionalDocumentoService } from './profissional-documento.service';

describe('ProfissionalDocumentoService', () => {
  let service: ProfissionalDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalDocumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
