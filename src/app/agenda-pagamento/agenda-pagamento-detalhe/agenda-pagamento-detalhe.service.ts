import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
import { AgendaPagamentoDetalhe } from './agenda-pagamento-detalhe';

@Injectable({
  providedIn: 'root'
})
export class AgendaPagamentoDetalheService extends BaseService<AgendaPagamentoDetalhe>{
  url : string =  `${environment.API}AgendaServicoPagamentoDetalhes`;
  constructor(protected http: HttpClient) {
    super(http,`${environment.API}AgendaServicoPagamentoDetalhes`);
  }
  recuperarInformacoes(codigoAgenda: number){
    let urlCon = this.url + '?codigoAgenda=' + codigoAgenda;
    return this.http.get<AgendaPagamentoDetalhe[]>(urlCon).pipe(take(1));
  }
}
