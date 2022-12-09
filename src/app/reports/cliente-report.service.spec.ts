import { TestBed } from '@angular/core/testing';

import { ClienteReportService } from './cliente-report.service';

describe('ClienteReportService', () => {
  let service: ClienteReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
