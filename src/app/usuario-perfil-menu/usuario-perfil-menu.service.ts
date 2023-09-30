import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Menu } from '../menu/menu';
import { BaseService } from '../shared/base.service';
import { UsuarioPerfiMenu } from './usuario-perfil-menu';

@Injectable({
  providedIn: 'root'
})
export class UsuarioPerfilMenuService extends BaseService<UsuarioPerfiMenu> {

  url = `${environment.API}UsuarioPerfilMenus`;
  
  constructor(protected http: HttpClient) {
    super(http, `${environment.API}UsuarioPerfilMenus`);
  }
  listarMenuPorPefil (codigoPerfil: Number){
    let urlListaPorPerfil =this.url + '/ListarPorPerfil?codigoPerfil=' + codigoPerfil;
    return this.http.get<Menu[]>(urlListaPorPerfil).pipe(take(1));
  }
}
