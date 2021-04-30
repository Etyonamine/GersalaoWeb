import { AlertService } from './../shared/alert/alert.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../auth-guard/auth.service';
import { Login } from './login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide: boolean = true;


  login: Login = <Login>{};



  constructor(
              private authService:AuthService,
              private alertService: AlertService) { }

  ngOnInit(): void {

  }

  fazerLogin(){

    this.authService.fazerLogin(this.login);

  }

  alert(){
    this.alertService.mensagemErro('testando no login');
  }
}
