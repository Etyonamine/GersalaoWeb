import { TestBed } from '@angular/core/testing';

import { ProfissionalReportService } from './profissional-report.service';

describe('ProfissionalReportService', () => {
  let service: ProfissionalReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
