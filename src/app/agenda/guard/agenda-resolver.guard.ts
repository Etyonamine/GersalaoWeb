import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Agenda } from '../agenda';
import { AgendaService } from '../agenda.service';
@Injectable({
  providedIn: 'root'
})
export class AgendaResolveGuard implements Resolve<Agenda>{
   
  agenda : Agenda;

  constructor(private agendaService: AgendaService){ }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Agenda | Observable<Agenda> | Promise<Agenda> {    

    if (route.params && route.params['codigo']) {                  
        let codigo = route.params['codigo'];
        return this.agendaService.get<Agenda>(codigo);                   
    }
    return of (this.agenda);
  }

}
