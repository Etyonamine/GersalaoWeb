import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { BaseService } from '../shared/base.service';
import { FormaPagamento } from './forma-pagamento';

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoService extends BaseService<FormaPagamento>{

  constructor(protected http: HttpClient)
  {
    super(http, `${environment.API}formaPagamento`);
   }
}
