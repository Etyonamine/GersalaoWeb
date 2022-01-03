import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { Pedido } from './pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService extends BaseService<Pedido> {
  url : string = `${environment.API}pedidos`;
  constructor(protected http: HttpClient) {
    super(http,`${environment.API}pedidos`);
  }  

  getPedido(codigoCliente:number, codigoPedido: number){
    let urlGet = this.url + '/' + codigoCliente + '/' + codigoPedido;
     
    return this.http.get<Pedido>(urlGet).pipe(take(1));
  }
}
