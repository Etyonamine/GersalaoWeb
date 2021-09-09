import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { Profissional } from 'src/app/profissional/professional';
import { ProfissionalService } from 'src/app/profissional/profissional.service';


@Injectable({
    providedIn: 'root'
  })

  export class ProfissionalResolveGuard implements Resolve<Profissional>{
    profissional:Profissional;
  
    constructor(
      private profissionalService: ProfissionalService
    ) { }
  
    resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Profissional | Observable<Profissional> | Promise<Profissional> {
      if (route.params && route.params['codigo']) {
        return this.profissionalService.get<Profissional>(route.params['codigo']);
      }
      return of (this.profissional);
    }
  
  }
  