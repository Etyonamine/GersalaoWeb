import { TestBed } from '@angular/core/testing';

import { ValidaCpfService } from './valida-cpf.service';

describe('ValidaCpfService', () => {
  let service: ValidaCpfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidaCpfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
