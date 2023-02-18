import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { CaixaTipoLancamento } from './caixa-tipo-lancamento';

@Injectable({
  providedIn: 'root'
})
export class CaixaTipoLancamentoService extends BaseService<CaixaTipoLancamento> {
  url : string =`${environment.API}CaixasTiposLancamentos`;
  constructor(protected http: HttpClient) {
    super(http,`${environment.API}CaixasTiposLancamentos`);
  }
}
