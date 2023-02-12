import { AlertService } from './../shared/alert/alert.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-guard/auth.service';
import { Login } from './login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseFormComponent } from '../shared/base-form/base-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseFormComponent implements OnInit {
  

  hide: boolean = true;
  login: Login = <Login>{};
  formulario:FormGroup;


  constructor(private formBuilder: FormBuilder,
              private authService:AuthService,
              private alertService: AlertService) {
                super();
               }

  ngOnInit(): void {
    this.authService.removerLoginArmazenado();
    this.criarFormulario();
  }
  submit() {
    this.login.login = this.formulario.get("login").value;
    this.login.senha = this.formulario.get("senha").value;
    this.authService.fazerLogin(this.login);
  }
  criarFormulario(){
      //formulario cliente
    this.formulario = this.formBuilder.group({
      login: [null, Validators.required],
      senha: [null, Validators.required]
    });
  }
 
  alert(){
    this.alertService.mensagemErro('testando no login');
  }
}
