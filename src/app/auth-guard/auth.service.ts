import { AlertService } from './../shared/alert/alert.service';
import { LoginService } from './../login/login.service';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from './../login/login';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioPesquisado: Login;
  usuarioAutenticado: boolean = false;
  mostrarMenuEmitter = new EventEmitter<boolean>();

  constructor(private router: Router,
    private loginService: LoginService,
    private alertService: AlertService) { }

  fazerLogin(usuario: Login) {

    var login : Login = <Login>{ login : usuario.nome , senha : usuario.senha};

    //pesquisando na base de dados
    this.loginService.validarLogin(login)
      .subscribe(httpLogin => {
        if (httpLogin){
          this.usuarioPesquisado = httpLogin;
          this.usuarioAutenticado = true;
          this.mostrarMenuEmitter.emit(true);
          //this.router.navigate(['/home']);
          this.router.navigate(['/home', httpLogin]);
        }else{
          this.alertService.mensagemErro('Usuário ou senha inválido!');
        }
      },
        error => {
          console.error(error.error);
          this.alertService.mensagemErro(error.error);
          return;
        });
  }

  usuarioEstaAutenticado() {
    return this.usuarioAutenticado;
  }

  fazerLogout() {
    this.usuarioAutenticado = false;
    this.mostrarMenuEmitter.emit(false);
    this.router.navigate(['/login']);
  }
}
