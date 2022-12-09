import { HttpClient, HttpParams } from '@angular/common/http';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { $ } from 'protractor';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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

  estoqueTotal2(){
    let urlEstoqueTotal = this.url + '/EstoqueTotal';
    this.http.get(urlEstoqueTotal).pipe(take(1));
  }

  estoqueTotal<ApiResult>(pageIndex: number,
          pageSize: number,
          sortColumn: string,
          sortOrder: string,
          filterColumn: string,
          filterQuery: string): Observable<ApiResult>
  {
    let urlEstoqueTotal = this.url + '/EstoqueTotal';

    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if (filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }
    return this.http.get<ApiResult>(urlEstoqueTotal, { params }).pipe(take(1));
  }

  valorVenda(codigoProduto){
    let urlValorVenda= this.url + '/valorVenda?codigoProduto=' + codigoProduto.toString();
    
    return this.http.post(urlValorVenda,null).pipe(take(1));
  }

  valorCusto(codigoProduto){
    let urlValorCusto= this.url + '/valorCusto?codigoProduto=' + codigoProduto.toString();
    
    return this.http.post(urlValorCusto,null).pipe(take(1));
  }

  estoquePorProduto(codigoProduto:number){
    let urlestoquePorProduto= this.url + '/estoquePorProduto?codigoProduto=' + codigoProduto.toString();
    
    return this.http.post<Estoque[]>(urlestoquePorProduto,null).pipe(take(1));
  }

  listaProdutosDisponiveis(){
    let urlestoqueProdutosDisponiveis= this.url + '/listaProdutosDisponiveis';
    
    return this.http.post<Estoque[]>(urlestoqueProdutosDisponiveis,null).pipe(take(1));
  }

  baixarEstoque(estoque : Estoque){
    let urlbaixarEstoque= this.url + "/BaixaDeEstoque";
    
    return this.http.post<Estoque[]>(urlbaixarEstoque,estoque).pipe(take(1));
  }

  adicionarQuantidadePorProduto(codigoProduto: number, quantidade: number){
    let urlAdcionarPorProdutoEstoque= this.url + "/AdicionarProdutoNoEstoque?codigoProduto=" + codigoProduto.toString() + "&quantidade=" + quantidade.toString() ;
    
    return this.http.post<Estoque[]>(urlAdcionarPorProdutoEstoque,null).pipe(take(1));
  }

  quantidadeEstoqueDisponivelPorProduto(codigoProduto:number){
    let urlquantidadeEstoque= this.url + "/QuantidadeDisponivelPorProduto?codigoProduto=" + codigoProduto  ;
    
    return this.http.post<number>(urlquantidadeEstoque,null).pipe(take(1));
  }
  
  estoqueProdutosQuantidadeTotal(){
    let urlquantidadeEstoque= this.url + "/estoqueProdutosQuantidadeTotal";
    
    return this.http.post<Estoque[]>(urlquantidadeEstoque,null).pipe(take(1));
  }

  estoqueListaProdutosQuantidadeTotal(lista : Array<number>){
    //EstoqueListaProdutosQuantidadeTotal
    let urlListaquantidadeEstoque= this.url + "/EstoqueListaProdutosQuantidadeTotal";
    
    return this.http.post<Estoque[]>(urlListaquantidadeEstoque,lista).pipe(take(1));
  }
}
