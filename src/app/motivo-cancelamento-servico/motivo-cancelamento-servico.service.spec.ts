import { TestBed } from '@angular/core/testing';

import { MotivoCancelamentoServicoService } from './motivo-cancelamento-servico.service';

describe('MotivoCancelamentoServicoService', () => {
  let service: MotivoCancelamentoServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotivoCancelamentoServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
