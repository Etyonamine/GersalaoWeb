import { HttpClient, HttpParams } from '@angular/common/http';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { BaseService } from '../shared/base.service';
import { Estoque } from './estoque';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService extends BaseService<Estoque>{

  url:string = `${environment.API}estoques`;

  constructor(protected http:HttpClient) 
  {
    super(http,`${environment.API}estoques`);
  }

  existeEstoque (estoque:Estoque){
    let urlExiste = this.url + '/ExisteEstoque'
    return this.http.post(urlExiste,estoque).pipe(take(1));
  }
  atualizarQuantidadeEstoque(estoque: Estoque){
    let urlAtualizaEstoque = this.url + '/AtualizarEstoque';
    return this.http.put(urlAtualizaEstoque,estoque).pipe(take(1));
  }
  listaEstoquePorProdutoDataEntrada(codigoProduto: number, dataEntrada: Date){
    var params = new HttpParams()
          .set("codigoProduto", codigoProduto.toString())
          .set("dataEntrada", dataEntrada.toDateString());

    return this.http.get<Estoque[]>(this.url,{params}).pipe(take(1));
  }
}
