import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { AgendaPagamento } from './agenda-pagamento';

@Injectable({
  providedIn: 'root'
})
export class AgendaPagamentoService extends BaseService<AgendaPagamento> {
  url : string =  `${environment.API}agendaservicopagamentos`;

  constructor(protected http: HttpClient) {
    super(http, `${environment.API}agendaservicopagamentos` );
  }
  salvarRegistro(agendaServicoPagamento: AgendaPagamento){
    return this.http.post(this.url, agendaServicoPagamento).pipe(take(1));
  }
  recuperarListaAgendaServicoPagamento(codigoAgenda:number){
    let urlLista = this.url;
    this.http.get<AgendaPagamento[]>(urlLista).pipe(take(1));
  }
  recuperarPagamentoAEstonarPorAgenda(codigoAgenda:number){
    let urlEstornar = this.url + '/PagamentosEstornarPorAgenda?codigoAgenda=' + codigoAgenda;
    return this.http.get<AgendaPagamento[]>(urlEstornar).pipe(take(1));
  }
  recuperarPagamentosStatusPagoPorData(dataHora:Date){
    let urlPago = this.url + '/';
    return this.http.get<AgendaPagamento[]>(urlPago).pipe(take(1));
  }
}
