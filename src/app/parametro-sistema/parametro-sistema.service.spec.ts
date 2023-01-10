import { TestBed } from '@angular/core/testing';

import { ParametroSistemaService } from './parametro-sistema.service';

describe('ParametroSistemaService', () => {
  let service: ParametroSistemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametroSistemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
