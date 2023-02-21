import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class ClienteFinanceiroResolveGuard implements Resolve<number>{
    
    constructor(){ }
  
    resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): number | Observable<number> | Promise<number> {
      if (route.params && route.params['codigo']) {         
          let codigoCliente = parseInt(route.params['codigo']);          
          return codigoCliente;                
      }
      return of (0);
    }
  
  }