import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { AgendaServicoPagamentoEstorno } from './agenda-servico-pagamento-estorno';

@Injectable({
  providedIn: 'root'
})
export class AgendaServicoPagamentoEstornoService extends BaseService<AgendaServicoPagamentoEstorno> {
  url : string = `${environment.API}AgendaServicoPagamentoEstornos`;
  constructor(protected http: HttpClient) {
    super(http,`${environment.API}AgendaServicoPagamentoEstornos`);
  }
  recuperarValorTotalPorData(dataHora: Date){
    let data_string = dataHora.toLocaleDateString().replace('/','-').replace('/','-');
    let hora_string = dataHora.toLocaleTimeString();
    let urlVlrTotal = this.url + '/valorTotalEstornoPorData/' + data_string+'/'+ hora_string;
    return this.http.get<number>(urlVlrTotal).pipe(take(1));
  }
}
