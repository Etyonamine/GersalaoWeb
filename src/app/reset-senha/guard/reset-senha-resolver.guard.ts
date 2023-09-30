import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable, of, Subscription } from 'rxjs';
import { ResetSenha } from '../reset-senha';
import { ResetSenhaService } from '../reset-senha.service';



@Injectable({
    providedIn: 'root'
  })

  export class ResetSenhaResolveGuard implements Resolve<string>{    

    resetSenha : ResetSenha;
    inscricao$ : Subscription;

    constructor( private passwordChangeRequestsService : ResetSenhaService   
    ) { }
  
    resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot):  | Observable<string> | Promise<string> {
      if (route.params && route.params['idGuid']) {
        
              return route.params['idGuid'];
           
      } 
      return of ("");
           
    }  
  }