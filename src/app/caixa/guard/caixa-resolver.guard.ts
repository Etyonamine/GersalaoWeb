import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { Caixa } from '../caixa';
import { CaixaService } from '../caixa.service';

@Injectable({
    providedIn: 'root'
  })
  export class CaixaResolveGuard implements Resolve<Caixa>{
    caixa: Caixa;
    inscricao$: Subscription;

    constructor(private caixaService: CaixaService) { }
    
      resolve(
        route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot): Caixa | Observable<Caixa> | Promise<Caixa> {
        if (route.params && route.params['codigo']) {
          let codigo = route.params['codigo'];
        return this.caixaService.get<Caixa>(codigo);
        }
        return of (this.caixa);
      }
  }