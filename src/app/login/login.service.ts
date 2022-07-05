import { subscribeOn, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
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
    let urlValidar = this.url + '?login=' + login.login + '&senha=' + login.senha;   
    return this.http.post<Usuario>(urlValidar, null).pipe(take(1));        
  }
}
