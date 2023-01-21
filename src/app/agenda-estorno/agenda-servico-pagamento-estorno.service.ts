import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { AgendaServicoPagamentoEstorno } from './agenda-servico-pagamento-estorno';

@Injectable({
  providedIn: 'root'
})
export class AgendaServicoPagamentoEstornoService extends BaseService<AgendaServicoPagamentoEstorno> {
  url : string = `${environment.API}/api/AgendaServicoPagamentoEstornos`;
  constructor(protected http: HttpClient) {
    super(http,`${environment.API}AgendaServicoPagamentoEstornos`);
  }
}
