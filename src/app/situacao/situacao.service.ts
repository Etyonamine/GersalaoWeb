import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../shared/base.service';
import { Injectable } from '@angular/core';
import { Situacao } from './situacao';

@Injectable({
  providedIn: 'root'
})
export class SituacaoService extends BaseService<Situacao> {

  constructor(protected http : HttpClient) {
    super(http, `${environment.API}Situacoes`);
  }
}
