import { TestBed } from '@angular/core/testing';

import { ServicoReportService } from './servico-report.service';

describe('ServicoReportService', () => {
  let service: ServicoReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicoReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
