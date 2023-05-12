import { TestBed } from '@angular/core/testing';

import { AgendaReportService } from './agenda-report.service';

describe('AgendaReportService', () => {
  let service: AgendaReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
