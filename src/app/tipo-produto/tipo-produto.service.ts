import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { TipoProduto } from './tipo-produto';

@Injectable({
  providedIn: 'root'
})
export class TipoProdutoService extends BaseService<TipoProduto>{

  constructor(http: HttpClient) {
    super(http, `${environment.API}tipoProdutos`);
  }
}
