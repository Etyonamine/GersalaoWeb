import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { ProdutoLinha } from '../produto-linha';
import { ProdutoLinhaService } from '../produto-linha.service';




@Injectable({
  providedIn: 'root'
})
export class ProdutoLinhaResolveGuard implements Resolve<ProdutoLinha>{
  produtoLinha:ProdutoLinha;  

  constructor(
    private produtoLinhaService: ProdutoLinhaService
  ) 
  {

  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): ProdutoLinha | Observable<ProdutoLinha> | Promise<ProdutoLinha> {
    if (route.params && route.params['codigo']) {
      return this.produtoLinhaService.get<ProdutoLinha>(route.params['codigo']);
    }
    return of (this.produtoLinha);
  }

}
