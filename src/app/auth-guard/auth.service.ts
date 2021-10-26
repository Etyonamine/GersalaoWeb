import { Usuario } from './../usuario/usuario';
import { AlertService } from './../shared/alert/alert.service';
import { LoginService } from './../login/login.service';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from './../login/login';
import { NullTemplateVisitor } from '@angular/compiler';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usuarioPesquisado: Login;
  usuarioLogado: Usuario = {
    Codigo: 0, Login: '',
    Nome: ''
  };
  usuarioAutenticado = false;
  mostrarMenuEmitter = new EventEmitter<boolean>();


  constructor(
    private router: Router,
    private loginService: LoginService,
    private alertService: AlertService
  ) {}


  fazerLogin(usuario: Login) {

    const login: Login =  { login: usuario.nome, senha: usuario.senha , Autenticado : usuario.Autenticado} as Login;

    // pesquisando na base de dados
    this.loginService.validarLogin(login).subscribe(
      (httpLogin) => {
        if (httpLogin) {

          this.usuarioLogado =  {} as Usuario;

          this.usuarioLogado.Codigo = httpLogin.codigo;
          this.usuarioLogado.Nome = httpLogin.nome;
          this.usuarioLogado.Login = httpLogin.login;


          localStorage.setItem('user_logged', JSON.stringify(this.usuarioLogado));
          this.usuarioPesquisado = httpLogin;
          this.usuarioAutenticado = true;
          this.mostrarMenuEmitter.emit(true);
          // this.router.navigate(['/home']);

          this.router.navigate(['/home']);
        } else {
          this.alertService.mensagemErro('Usuário ou senha inválido!');
        }
      },
      (error) => {
        console.error(error.error);
        this.alertService.mensagemErro(error.error);
        return;
      }
    );
  }

  usuarioEstaAutenticado() {
    return this.usuarioAutenticado;
  }

  fazerLogout() {
    this.usuarioAutenticado = false;
    this.mostrarMenuEmitter.emit(false);
    this.router.navigate(['/login']);
  }

  getUserData() {

    this.usuarioLogado = JSON.parse(localStorage.getItem('user_logged'));
    this.usuarioAutenticado = this.usuarioLogado != null;
 }
}
