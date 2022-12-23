import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { TipoProduto } from '../tipo-produto';
import { TipoProdutoService } from '../tipo-produto.service';

@Injectable({
  providedIn: 'root'
})
export class TipoProdutoResolveGuard implements Resolve<TipoProduto>{
  tipoProduto:TipoProduto;

  constructor(
    private tipoProdutoService: TipoProdutoService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): TipoProduto | Observable<TipoProduto> | Promise<TipoProduto> {
    if (route.params && route.params['codigo']) {
      return this.tipoProdutoService.get<TipoProduto>(route.params['codigo']);
    }
    return of (this.tipoProduto);
  }

}
