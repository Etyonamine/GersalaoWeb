import { subscribeOn, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../shared/base.service';
import { Injectable } from '@angular/core';
import { Login } from './login';
import { AlertService } from '../shared/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService<Login>{


  constructor(protected http: HttpClient,
              private alertService: AlertService) {
    super(http, `${environment.API}usuarios`);
  }
  validarLogin(login: Login){
    var url: string = `${environment.API}usuarios`;
    
    return this.http.post<Login>(url, login).pipe(take(1));        
  }
}
