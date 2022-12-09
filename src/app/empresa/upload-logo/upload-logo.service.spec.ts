import { TestBed } from '@angular/core/testing';

import { UploadLogoService } from './upload-logo.service';

describe('UploadLogoService', () => {
  let service: UploadLogoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadLogoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
