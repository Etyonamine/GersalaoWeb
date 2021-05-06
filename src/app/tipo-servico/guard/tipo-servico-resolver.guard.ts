import { TipoServicoService } from './../tipo-servico.service';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { TipoServico } from '../tipo-servico';

@Injectable({
  providedIn: 'root'
})
export class TipoServicoResolveGuard implements Resolve<TipoServico>{
  tipoServico:TipoServico;

  constructor(
    private tipoServicoService: TipoServicoService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): TipoServico | Observable<TipoServico> | Promise<TipoServico> {
    if (route.params && route.params['codigo']) {
      return this.tipoServicoService.get<TipoServico>(route.params['codigo']);
    }
    return of (this.tipoServico);
  }

}
