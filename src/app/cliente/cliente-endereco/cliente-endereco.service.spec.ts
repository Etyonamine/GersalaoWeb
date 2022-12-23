import { TestBed } from '@angular/core/testing';

import { ClienteEnderecoService } from './cliente-endereco.service';

describe('ClienteEnderecoService', () => {
  let service: ClienteEnderecoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteEnderecoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
