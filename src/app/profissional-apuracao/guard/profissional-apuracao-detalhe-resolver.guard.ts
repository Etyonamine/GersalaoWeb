import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { Profissional } from 'src/app/profissional/professional';
import { ProfissionalApuracaoDetalhe } from '../profissional-apuracao-detalhe/profissional-apuracao-detalhe';


@Injectable({
    providedIn: 'root'
  })

  export class ProfissionalApuracaoDetalheResolveGuard {
    
    codigoRetorno : number;
    constructor(      
    ) { }
  
    resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): number | Observable<number> | Promise<number> {
      this.codigoRetorno = 0 ;
      
      if (route.params && route.params['codigo']) {
        return route.params['codigo'];
      }
      return of (this.codigoRetorno);
    }
  
  }
  