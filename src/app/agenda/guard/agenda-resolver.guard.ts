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

    let agenda = {} as Agenda;

    if (route.params && route.params['dataSelecionada']) {                  
        agenda.data = route.params['dataSelecionada'];        
    }
    return of (agenda);
  }

}
