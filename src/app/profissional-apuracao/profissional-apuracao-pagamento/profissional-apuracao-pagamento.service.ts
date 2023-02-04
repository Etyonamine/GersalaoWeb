import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
import { ProfissionalApuracaoPagamento } from './profissional-apuracao-pagamento';
import { ProfissionalPagamentoCancelarIn } from './profissional-pagamento-cancelar-in';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalApuracaoPagamentoService extends BaseService<ProfissionalApuracaoPagamento> {
  url : string = `${environment.API}profissionalApuracaoPagamentos`;
  constructor(protected http: HttpClient) {
    super(http, `${environment.API}profissionalApuracaoPagamentos`);
  }

  recuperarLista(codigoApuracao: number){
    let urlGet = this.url + '/' + codigoApuracao;
    return this.http.get<ProfissionalApuracaoPagamento[]>(urlGet).pipe(take(1));
  }
  cancelarPagamento(profissionalPagamentoCancelarIn: ProfissionalPagamentoCancelarIn){
    let urlCancelar = this.url + '/cancelar';
    return this.http.put(urlCancelar,profissionalPagamentoCancelarIn ).pipe(take(1));
  }
}
