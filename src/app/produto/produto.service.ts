import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { BaseService } from '../shared/base.service';
import { Produto } from './produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService extends BaseService<Produto> {

  constructor(http: HttpClient) {
    super(http, `${environment.API}Produtos`);
   }
}
