import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { TipoContato } from './tipo-contato';

@Injectable({
  providedIn: 'root'
})
export class TipoContatoService extends BaseService<TipoContato>
{
  constructor(protected http:HttpClient) {
     super(http,`${environment.API}tipocontato`); 
  }
}
