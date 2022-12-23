import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../shared/base.service';
import { Injectable } from '@angular/core';
import { TipoServico } from './tipo-servico';

@Injectable({
  providedIn: 'root'
})
export class TipoServicoService extends BaseService<TipoServico> {

  constructor(protected http : HttpClient) {
    super(http, `${environment.API}tipoServicos`);
  }
}
