import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { FormaPagamento } from './forma-pagamento';

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoService extends BaseService<FormaPagamento>{
  url: string = `${environment.API}FormasPagamento`;

  constructor(protected http: HttpClient)
  {
    super(http, `${environment.API}FormasPagamento`);
   }
   listarFormasPagamentoApuracao(){
    let urlListaApr = this.url +  '/ListaFormaPagtoApuracao';
    return this.http.get<FormaPagamento[]>(urlListaApr).pipe(take(1));
   }
}
