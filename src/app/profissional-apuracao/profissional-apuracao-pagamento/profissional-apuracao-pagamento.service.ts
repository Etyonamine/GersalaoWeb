import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
import { ProfissionalApuracaoPagamento } from './profissional-apuracao-pagamento';

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
}
