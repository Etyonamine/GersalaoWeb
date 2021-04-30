import { Contato } from 'src/app/contato/contato';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../shared/base.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ContatoService extends BaseService<Contato>{

  constructor(protected http:HttpClient) {
    super(http, `${environment.API}contatos`);
  }

}
