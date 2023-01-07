import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { AgendaServico } from './agenda-servico';
import { AgendaServicoEdit } from './agenda-servico-edit/agenda-servico-edit';

@Injectable({
  providedIn: 'root'
})
export class AgendaServicosService extends BaseService<AgendaServico> {

  constructor(protected http : HttpClient) { super(http, `${environment.API}agendas` );}
  url : string = `${environment.API}agendaservicos`;

  quantidadePorProfissional(codigo:number){
    let urlQuantidade = this.url + '/quantidadePorProfissional/'+ codigo.toString();
    return this.http.post(urlQuantidade, null).pipe(take(1));     
  }
  atualizarObservacao(agendaServicoEdit: AgendaServicoEdit )  {
    let urlAtualizar = this.url;
    return this.http.put(urlAtualizar, agendaServicoEdit).pipe(take(1));
  }
  recuperarServico(servico:AgendaServico){
    let urlGet = this.url + '?codigoAgenda='+ servico.codigoAgenda + '&codigoProfissional=' + servico.codigoProfissional + '&codigoServico=' + servico.codigoServico;
    return this.http.get<AgendaServico>(urlGet).pipe(take(1));
  }
}
