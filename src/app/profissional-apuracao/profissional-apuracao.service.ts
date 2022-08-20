import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { ProfissionalApuracao } from './profissional-apuracao';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalApuracaoService extends BaseService<ProfissionalApuracao>{
  url : string = `${environment.API}profissionalApuracao`;
  constructor(protected http: HttpClient,) {
    super(http, `${environment.API}profissionalApuracao`);
  }
}
