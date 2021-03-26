import { TestBed } from '@angular/core/testing';

import { ClienteContatoService } from './cliente-contato.service';

describe('ClienteContatoService', () => {
  let service: ClienteContatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteContatoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
