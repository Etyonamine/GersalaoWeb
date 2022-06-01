import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { BaseService } from '../shared/base.service';
import { Fornecedor } from './fornecedor';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService extends BaseService<Fornecedor> {

  constructor(protected http:HttpClient) {
    super(http, `${ environment.API}fornecedores`);
   }
}
