import { TestBed } from '@angular/core/testing';

import { TokenInterceptorServiceInterceptor } from './token-interceptor-service.interceptor';

describe('TokenInterceptorServiceInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TokenInterceptorServiceInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TokenInterceptorServiceInterceptor = TestBed.inject(TokenInterceptorServiceInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
