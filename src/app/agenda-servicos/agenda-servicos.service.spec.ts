import { TestBed } from '@angular/core/testing';

import { AgendaServicosService } from './agenda-servicos.service';

describe('AgendaServicosService', () => {
  let service: AgendaServicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaServicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
