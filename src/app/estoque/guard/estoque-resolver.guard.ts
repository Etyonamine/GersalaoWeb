import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Estoque } from '../Estoque';
import { EstoqueService } from '../estoque.service';


@Injectable({
  providedIn: 'root'
})
export class EstoqueResolveGuard implements Resolve<Estoque[]>{
  estoque:Estoque[];  

  constructor(
    private estoqueService: EstoqueService
  ){ }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Estoque[] | Observable<Estoque[]> | Promise<Estoque[]> {
    if (route.params && route.params['codigo'] && route.params['dataEntrada']) {         
        let codigoProduto = parseInt(route.params['codigo']);
        let dataEntrada = route.params['dataEntrada'];
        
        return this.estoqueService.listaEstoquePorProdutoDataEntrada(codigoProduto,new Date(dataEntrada));
              
    }
    return of (this.estoque);
  }

}
