import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { BaseService } from '../shared/base.service';
import { CompraDetalhe } from './compra-detalhe';

@Injectable({
  providedIn: 'root'
})
export class CompraDetalheService extends BaseService<CompraDetalhe> {
  url = `${environment.API}comprasdetalhes`;

  constructor(protected http:HttpClient) { 
    super(http,`${environment.API}comprasdetalhes`);
  }
  //excluir todos os produtos da  compra.
  excluirTodosProdutos(codigoCompra : number){
   let urlParam = `this.url + '\TodosProdutos\' + codigoCompra`;
    return this.http.delete(urlParam).pipe(take(1));
  }

  salvarLista(lista : Array<CompraDetalhe>){

    return this.http.post(this.url,lista).pipe(take(1));
  }
}
