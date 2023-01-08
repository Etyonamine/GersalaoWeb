import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { Agenda } from './agenda';
import { AgendaBaixa } from './agenda-baixa';
import { AgendaCancelar } from './agenda-cancelar';
import { AgendaGravarNovo } from './agenda-gravar-novo';
import { AgendaIn } from './agenda-in';

import { AgendaValidacao } from './agenda-validacao';

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

  baixaApuracao (codigoApuracao: number)
  {
    let urlBaixaApuracao = this.url + '/BaixaApuracao?codigoApuracao=' + codigoApuracao;
    return this.http.put<boolean>(urlBaixaApuracao, null).pipe(take(1));
  }
  alterarStatusPendenteApuracao(lista:Array<number>){
   let urlAlterarStatus = this.url + '/AlterarStatusPendenteApuracaoLote';
   return this.http.put<boolean>(urlAlterarStatus, lista).pipe(take(1));
  }
  cancelarAgendamento(agendaCancelamento: AgendaCancelar){
    let urlBaixa = this.url + '/CancelarAgendamento';
    return this.http.put<boolean>(urlBaixa, agendaCancelamento).pipe(take(1));
  }
  obterAgendaPorDia(data:string){
    let urlAgenda = this.url + '/ListarPorData?dataAgenda=' + data;
    return this.http.get<Array<Agenda>>(urlAgenda).pipe(take(1));
  }
  listarAgendasPendentesApuracaoPorProfissional <ApiResult>(codigoProfissional:number,
    inicioPeriodo : Date,
    fimPeriodo : Date,
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string): Observable<ApiResult> {
      let urlpendentesApuraProfi = this.url +'/ListaAgendasApurarPorProfissional';

        var params = new HttpParams()
          .set("codigoProfissionalPar", codigoProfissional.toString())
          .set("inicioPeriodoPar", inicioPeriodo.toDateString())
          .set("fimPeriodoPar", fimPeriodo.toDateString())
          .set("pageIndex", pageIndex.toString())
          .set("pageSize", pageSize.toString())
          .set("sortColumn", sortColumn)
          .set("sortOrder", sortOrder);

        if (filterQuery) {
          params = params
            .set("filterColumn", filterColumn)
            .set("filterQuery", filterQuery);
        }
    return this.http.get<ApiResult>(urlpendentesApuraProfi, { params }).pipe(take(1));
  }  
  salvarNovoRegistro(agendaGravarNovo: AgendaGravarNovo){
    let urlgravarNovo= this.url ;
    agendaGravarNovo.Data = btoa(agendaGravarNovo.Data);
    agendaGravarNovo.HoraInicio = btoa(agendaGravarNovo.HoraInicio);
    agendaGravarNovo.HoraFim = btoa(agendaGravarNovo.HoraFim);
    if (agendaGravarNovo.Observacao!== undefined && agendaGravarNovo.Observacao!== null){
      agendaGravarNovo.Observacao = btoa(agendaGravarNovo.Observacao);
    }
    if (agendaGravarNovo.Servicos.length>0){
      agendaGravarNovo.Servicos.forEach(serv=>{
        let texto = serv.observacao!=undefined ? btoa(serv.observacao):null;        
        serv.observacao = texto;
      })
    }    
    return this.http.post<boolean>(urlgravarNovo, agendaGravarNovo).pipe(take(1));
  }
  atualizarRegistro(agenda:Agenda){
    let urlAtualizar = this.url + "?codigo=" + agenda.codigo;
    return this.http.put(urlAtualizar,agenda).pipe(take(1));
  }
  validaHoraInicialDeAgendamento(hora:string){
    let horaCripto = btoa(hora);
    let urlvalidarHora = this.url + '/HoraInicialDeAgendamentoValida?hora='+ horaCripto;
    return this.http.post<boolean>(urlvalidarHora, null).pipe(take(1));
  }
  validaHoraFimDeAgendamento(hora:string){
    let horaCripto = btoa(hora);
    let urlvalidarHora = this.url + '/HoraFimDeAgendamentoValida?hora='+ horaCripto;
    return this.http.post<boolean>(urlvalidarHora, null).pipe(take(1));
  }
  validarInfoAgendamento(agendaIn: AgendaIn){
    let urlValidacao = this.url + '/ValidacaoAgendamento';
    return this.http.post<AgendaValidacao>(urlValidacao, agendaIn).pipe(take(1));
  }  
}
