import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { ResetSenha } from './reset-senha';

@Injectable({
  providedIn: 'root'
})
export class ResetSenhaService extends BaseService<ResetSenha>{

  constructor(protected http : HttpClient) {
    super(http, `${environment.API}resetSenha` );
   }
}
