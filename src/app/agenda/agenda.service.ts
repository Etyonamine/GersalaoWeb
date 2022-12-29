import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { Agenda } from './agenda';
import { AgendaApurar } from './agenda-apurar';
import { AgendaBaixa } from './agenda-baixa';
import { AgendaCancelar } from './agenda-cancelar';
import { AgendaGravarNovo } from './agenda-gravar-novo';
import { AgendaIsDupe } from './agenda-is-dupe';

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
  isDupeAgenda(agendaIsDupe  : AgendaIsDupe){
    let urlDupe = this.url + '/isDupe';
    return this.http.post<boolean>(urlDupe, agendaIsDupe).pipe(take(1));
  }
  salvarNovoRegistro(agendaGravarNovo: AgendaGravarNovo){
    let urlgravarNovo= this.url ;
    agendaGravarNovo.data = btoa(agendaGravarNovo.data);
    agendaGravarNovo.hora = btoa(agendaGravarNovo.hora);
    if (agendaGravarNovo.observacao!== undefined){
      agendaGravarNovo.observacao = btoa(agendaGravarNovo.observacao);
    }
    return this.http.post<boolean>(urlgravarNovo, agendaGravarNovo).pipe(take(1));
  }
  validaHoraDeAgendamento(hora:string){
    let horaCripto = btoa(hora);
    let urlvalidarHora = this.url + '/HoraDeAgendamentoValida?hora='+ horaCripto;
    return this.http.post<boolean>(urlvalidarHora, null).pipe(take(1));
  }
}
