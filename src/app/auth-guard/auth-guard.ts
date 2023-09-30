import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
              private authService: AuthService,
              private router: Router
              ) { }

  private verificarAcesso(){
    if (this.authService.usuarioEstaAutenticado()){
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }

  canLoad(route: Route,
          segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean>
  {
    // console.log('canLoad: verificando se usuário pode carregar');
    return this.verificarAcesso();
  }

  canActivate(
              route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean | Observable<boolean>
  {
    // console.log('AuthGuard');
    return this.verificarAcesso();
  }


}
