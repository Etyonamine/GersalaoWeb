import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Pedido } from '../pedido';
import { PedidoService } from '../pedido.service';



@Injectable({
  providedIn: 'root'
})
export class PedidoResolveGuard implements Resolve<Pedido>{
  pedido:Pedido;  

  constructor(
    private pedidoService: PedidoService
  ){ }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Pedido | Observable<Pedido> | Promise<Pedido> {
    if (route.params && route.params['codigoPedido'] && route.params['codigoCliente']) {         
        let codigoPedido = parseInt(route.params['codigoPedido']);
        let codigoCliente = parseInt(route.params['codigoCliente']);
        
        return this.pedidoService.getPedido(codigoPedido,codigoCliente);
              
    }
    return of (this.pedido);
  }

}
