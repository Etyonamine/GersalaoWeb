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
 
  salvarNovoRegistro(pedido : Pedido){
    return this.http.post<Pedido>(this.url, pedido).pipe(take(1));
  }
  getProximoID (){
    let urlGetID = this.url + '/GetProximoID';
     
    return this.http.post<number>(urlGetID,null).pipe(take(1));
  }
  
}
