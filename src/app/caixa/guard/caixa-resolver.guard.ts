import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Caixa } from '../caixa';

@Injectable({
    providedIn: 'root'
  })
  export class CaixaResolveGuard implements Resolve<Caixa>{
    caixa: Caixa;

    constructor() { }
    
      resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Caixa | Observable<Caixa> | Promise<Caixa> {
        /* if (route.params && route.params['codigo']) {
          
        } */
        return of (this.caixa);
      }
  }