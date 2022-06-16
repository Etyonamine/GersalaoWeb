import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../shared/base.service';
import { Injectable } from '@angular/core';
import { Servico } from './servico';

@Injectable({
  providedIn: 'root'
})
export class ServicosService extends BaseService<Servico>{

  constructor(protected http : HttpClient) {
    super(http,`${environment.API}Servicos`);
  }
}
