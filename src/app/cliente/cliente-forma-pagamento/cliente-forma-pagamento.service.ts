import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment.prod';
import { ClienteFormaPagamento } from './cliente-forma-pagamento';

@Injectable({
  providedIn: 'root'
})
export class ClienteFormaPagamentoService extends BaseService<ClienteFormaPagamento> {

  constructor(protected http: HttpClient) {
    super (http,`${environment.API}ClientesFormaPagamento`)
   }
}
