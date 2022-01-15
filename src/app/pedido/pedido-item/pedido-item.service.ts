import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';
import { environment } from 'src/environments/environment.prod';
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
          .set("codigoCliente", codigoCliente.toString())
          .set("codigoPedido", codigoPedido.toString())
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
}
