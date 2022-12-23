import { ServicosService } from './../servicos.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { Servico } from '../servico';

@Injectable({
  providedIn: 'root'
})
export class ServicoResolveGuard implements Resolve<Servico>{
  servico:Servico;

  constructor(
    private servicoService: ServicosService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Servico | Observable<Servico> | Promise<Servico> {
    if (route.params && route.params[ 'codigo' ]) {
      return this.servicoService.get<Servico>(route.params[ 'codigo' ]);
    }
    return of (this.servico);
  }

}
