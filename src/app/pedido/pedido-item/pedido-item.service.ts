import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment';
import { Pedido } from '../pedido';
import { PedidoItem } from './pedido-item';

@Injectable({
  providedIn: 'root'
})
export class PedidoItemService extends BaseService<PedidoItem>{
  url : string = `${environment.API}pedidoItems`;
  constructor(protected http: HttpClient) {
    super(http,`${environment.API}pedidoItems`)
   }

   getDataCodigo<ApiResult>(
    codigoCliente:number,
    codigoPedido:number,
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string): Observable<ApiResult> {


        var params = new HttpParams()
          .set("codigoCliente", codigoCliente !== null? codigoCliente.toString(): '0')
          .set("codigoPedido", codigoPedido!== null?codigoPedido.toString():'0')
          .set("pageIndex", pageIndex.toString())
          .set("pageSize", pageSize.toString())
          .set("sortColumn", sortColumn)
          .set("sortOrder", sortOrder);

        if (filterQuery) {
          params = params
            .set("filterColumn", filterColumn)
            .set("filterQuery", filterQuery);
        }
    return this.http.get<ApiResult>(this.url , { params }).pipe(take(1));
  
  
  }

  salvarNovoRegistro(item:PedidoItem){    
    return this.http.post<PedidoItem>(this.url,item).pipe(take(1));
  }

  atualizarRegistro (item: PedidoItem)
  {
    let urlAtualiza = this.url + `/${item.codigoPedido}/${item.codigo}`;
    return this.http.put<PedidoItem>(urlAtualiza,item).pipe(take(1));
  }
  
  excluirItem(codigoItem:number, codigoPedido:number  ){
    let urlDelete = this.url + `/${codigoPedido}/${codigoItem}`;
    return this.http.delete(urlDelete).pipe(take(1));
  }

  listaPorPedido(codigoPedido : number){
    let urllista = this.url + `/ListaPorPedido?codigoPedido = ` + codigoPedido;
    return this.http.get<PedidoItem[]>(urllista).pipe(take(1));
    
  }
}
