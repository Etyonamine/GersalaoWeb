import { ClienteService } from './../cliente.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Cliente } from '../cliente';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteResolveGuard implements Resolve<Cliente>{
  cliente:Cliente;

  constructor(
    private clienteService: ClienteService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Cliente | Observable<Cliente> | Promise<Cliente> {
    if (route.params && route.params['codigo']) {
      return this.clienteService.get<Cliente>(route.params['codigo']);
    }
    return of (this.cliente);
  }

}
