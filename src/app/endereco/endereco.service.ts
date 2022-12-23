import { BaseService } from './../shared/base.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Endereco } from './endereco';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService extends BaseService<Endereco>{

  constructor(protected http : HttpClient) {
    super(http,  `${environment.API}enderecos`);
  }
}
