import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { Caixa } from './caixa';
import { CaixaDetalhe } from './caixa-detalhe';

@Injectable({
  providedIn: 'root'
})
export class CaixaDetalheService extends BaseService<CaixaDetalhe> {
  url : string =`${environment.API}CaixasDetalhes`;
  constructor(protected http: HttpClient) {
    super(http,`${environment.API}CaixasDetalhes`);
  }   
  recuperarLista(codigoCaixa:number){
    let urllista = this.url + '/' + codigoCaixa;
    return this.http.get<CaixaDetalhe[]>(urllista).pipe(take(1));
  }
}
