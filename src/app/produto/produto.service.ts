import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { BaseService } from '../shared/base.service';
import { Produto } from './produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService extends BaseService<Produto> {

  urlBase : string = `${environment.API}Produtos`;

  constructor(http: HttpClient) {
    super(http, `${environment.API}Produtos`);
   }

  ListarTodos(){
    let urlLista = this.urlBase + '/Lista';
    return this.http.get<Produto[]>(urlLista).pipe(take(1));
  }
}
