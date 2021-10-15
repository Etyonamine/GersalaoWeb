import { TestBed } from '@angular/core/testing';

import { ValidaCnpjService } from './valida-cnpj.service';

describe('ValidaCnpjService', () => {
  let service: ValidaCnpjService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidaCnpjService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
