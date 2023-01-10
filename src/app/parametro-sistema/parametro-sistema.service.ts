import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { ParametroSistema } from './parametro-sistema';

@Injectable({
  providedIn: 'root'
})
export class ParametroSistemaService extends BaseService<ParametroSistema> {

  url = `${environment.API}ParametroSistema`;

  constructor(protected http : HttpClient) {
    super(http,`${environment.API}ParametroSistema`);
  }
}
