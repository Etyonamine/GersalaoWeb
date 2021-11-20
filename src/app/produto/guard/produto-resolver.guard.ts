import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { Produto } from '../produto';
import { ProdutoService } from '../produto.service';



@Injectable({
  providedIn: 'root'
})
export class ProdutoResolveGuard implements Resolve<Produto>{
  produto:Produto;  

  constructor(
    private produtoService: ProdutoService
  ) 
  {

  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Produto | Observable<Produto> | Promise<Produto> {
    if (route.params && route.params['codigo']) {
      return this.produtoService.get<Produto>(route.params['codigo']);
    }
    return of (this.produto);
  }

}
