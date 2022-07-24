import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Agenda } from '../agenda';



@Injectable({
  providedIn: 'root'
})
export class AgendaResolveGuard implements Resolve<Agenda>{
   

  constructor(){ }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Agenda | Observable<Agenda> | Promise<Agenda> {
    /* if (route.params && route.params['codigo']) {         
         
        return this.compraService.get<Agenda>(route.params['codigo']);
        
        
      
    }
    
    return of (this.compra); */
    let agenda = {} as Agenda
    return (agenda);
  }

}
