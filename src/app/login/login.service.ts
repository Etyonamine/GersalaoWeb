import { subscribeOn, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './../shared/base.service';
import { Injectable } from '@angular/core';
import { Login } from './login';
import { AlertService } from '../shared/alert/alert.service';
import { Usuario } from '../usuario/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService<Login>{

  url: string = `${environment.API}usuarios`;

  constructor(protected http: HttpClient,
              private alertService: AlertService) {
    super(http, `${environment.API}usuarios`);
  }
  validarLogin(login: Login){ 
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let loginCriptoGrafado = btoa(login.login); 
    let SenhaCriptoGrafado = btoa(login.senha); 
    let objLoginCriptografado = { nome : '' ,codigo: '', tokenAutorizacao: '', codigoUsuarioPerfil: '', login: loginCriptoGrafado, senha: SenhaCriptoGrafado } as unknown as Login;

    let urlValidar = this.url ;  
    return this.http.post<Login>(urlValidar,objLoginCriptografado,httpOptions ).pipe(take(1));        
  }
}
