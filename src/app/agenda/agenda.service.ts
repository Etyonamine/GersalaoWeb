import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { Agenda } from './agenda';
import { AgendaBaixa } from './agenda-baixa';
import { AgendaCancelar } from './agenda-cancelar';

@Injectable({
  providedIn: 'root'
})
export class AgendaService extends BaseService<Agenda>{

  constructor(protected http : HttpClient) { super(http, `${environment.API}agendas` );}

  url : string = `${environment.API}agendas`;

  baixaAgendamento(agendaBaixa:AgendaBaixa){
    let urlBaixa = this.url + '/BaixaAgendamento';
    return this.http.post<boolean>(urlBaixa, agendaBaixa).pipe(take(1));
  }
  cancelarAgendamento(agendaCancelamento: AgendaCancelar){
    let urlBaixa = this.url + '/CancelarAgendamento';
    return this.http.put<boolean>(urlBaixa, agendaCancelamento).pipe(take(1));
  }
}
