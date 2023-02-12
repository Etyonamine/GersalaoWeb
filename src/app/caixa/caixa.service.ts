import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { Caixa } from './caixa';

@Injectable({
  providedIn: 'root'
})
export class CaixaService extends BaseService<Caixa> {
  url : string =`${environment.API}Caixas`;
  constructor(protected http: HttpClient) {
    super(http,`${environment.API}Caixas`);
  }   
}
