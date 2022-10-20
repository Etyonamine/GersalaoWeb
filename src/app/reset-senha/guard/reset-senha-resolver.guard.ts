import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { ResetSenha } from '../reset-senha';



@Injectable({
    providedIn: 'root'
  })

  export class ProfissionalResolveGuard implements Resolve<ResetSenha>{    
    resetSenha : ResetSenha;
    constructor(    
    ) { }
  
    resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): ResetSenha | Observable<ResetSenha> | Promise<ResetSenha> {
       
      return of (this.resetSenha);
    }  
  }