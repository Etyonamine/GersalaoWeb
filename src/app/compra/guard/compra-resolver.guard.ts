import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Compra } from '../compra';
import { CompraServiceService } from '../compra-service.service';

@Injectable({
  providedIn: 'root'
})
export class CompraResolveGuard {
  compra:Compra;  

  constructor(
    private compraService: CompraServiceService
  ){ }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Compra | Observable<Compra> | Promise<Compra> {
    if (route.params && route.params['codigo']) {         
         
        return this.compraService.get<Compra>(route.params['codigo']);
        
        
      
    }
    return of (this.compra);
  }

}
