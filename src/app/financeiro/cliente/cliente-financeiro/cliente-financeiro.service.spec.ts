import { TestBed } from '@angular/core/testing';

import { ClienteFinanceiroService } from './cliente-financeiro.service';

describe('ClienteFinanceiroService', () => {
  let service: ClienteFinanceiroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteFinanceiroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
