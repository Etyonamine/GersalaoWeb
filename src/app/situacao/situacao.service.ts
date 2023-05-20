import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../shared/base.service';
import { Injectable } from '@angular/core';
import { Situacao } from './situacao';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SituacaoService extends BaseService<Situacao> {

  url = `${environment.API}Situacoes`;

  constructor(protected http : HttpClient) {
    super(http, `${environment.API}Situacoes`);
  }

  listaPorTipo(codigoTipo: number){
    var urlconsulta = this.url + '/ListaPorTipo/' + codigoTipo;
    return this.http.get<Array<Situacao>>(urlconsulta).pipe(take(1));
  }
}
