import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

@Injectable()
export class TokenInterceptorServiceInterceptor implements HttpInterceptor {

  constructor(private authService : AuthService) {}

  intercept(
            request: HttpRequest<any>, 
            next: HttpHandler): Observable<HttpEvent<any>> {
              const dupReq = request.clone({
                headers: request.headers.set('Authorization', `barear ${this.authService.recuperarToken()}`)
              })
    return next.handle(dupReq);
  }
}
