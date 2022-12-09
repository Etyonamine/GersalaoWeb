

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Usuario } from '../usuario';
import { UsuarioService } from '../usuario.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioResolveGuard implements Resolve<Usuario>{
  usuario:Usuario;

  constructor(
    private usuarioService: UsuarioService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Usuario | Observable<Usuario> | Promise<Usuario> {
    if (route.params && route.params['login']) {
      return this.usuarioService.get<Usuario>(route.params['login']);
    }
    return of (this.usuario);
  }

}
