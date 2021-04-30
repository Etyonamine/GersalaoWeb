import { TestBed } from '@angular/core/testing';

import { ClienteDocumentoService } from './cliente-documento.service';

describe('ClienteDocumentoService', () => {
  let service: ClienteDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteDocumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
