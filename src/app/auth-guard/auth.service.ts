import { Usuario } from './../usuario/usuario';
import { AlertService } from './../shared/alert/alert.service';
import { LoginService } from './../login/login.service';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from './../login/login';
import { concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';
import { Logged } from '../login/logged.component';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usuarioPesquisado: Login;
  usuarioLogado: Logged = {
    codigo : 0,
    login: ''
  };

  tokenStorage: string ='tokenAuthentic';
  loginStorage: string = 'loginAuthentic';

  usuarioAutenticado = false;
  mostrarMenuEmitter = new EventEmitter<boolean>();
  Codigo : number; 

  constructor(
    private router: Router,
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private alertService: AlertService
  ) {}


  fazerLogin(usuario: Login) {

    const login: Login =  { login: usuario.nome, senha: usuario.senha , Autenticado : usuario.Autenticado} as Login;
    let usuarioEncontrado = {} as Usuario;
    this.mostrarMenuEmitter.emit(false);
    // pesquisando na base de dados
    this.loginService.validarLogin(login)
                      .subscribe(resposta => {
                                  if (resposta.tokenAutenticado !=='')
                                  {          
                                      var usuarioLogged ={ codigo : resposta.codigo, login : resposta.login } as Logged;

                                      localStorage.setItem(this.tokenStorage, JSON.stringify(resposta.tokenAutenticado));                                      
                                      localStorage.setItem(this.loginStorage, JSON.stringify(usuarioLogged));          
                                       
                                      this.mostrarMenuEmitter.emit(true);
                                      this.usuarioAutenticado = true;
                                      this.router.navigate(['/home']); 
                                  }else{
                                    this.alertService.mensagemExclamation('Usuario ou senha inválido!');
                                  }     
                                }, error => {
                                    console.error(error.error);
                                    if (error.status = "404"){
                                      this.alertService.mensagemExclamation('Usuario ou senha inválido!');
                                    }else{
                                      this.alertService.mensagemErro('Ocorreu um erro ao tentar validar o seu acesso!');
                                    }
                                    
                                    return;
                                  }
                                );
  }

  usuarioEstaAutenticado() {
    return this.usuarioAutenticado;
  }

  fazerLogout() {
    localStorage.removeItem(this.loginStorage);
    localStorage.removeItem(this.tokenStorage);
    this.usuarioAutenticado = false;
    this.usuarioLogado = {} as Login;
    this.mostrarMenuEmitter.emit(false);
    this.router.navigate(['/login']);
    
  }

  getUserData() {

    let usuarioLogged  = { 
      codigo : 0,
      login : ''
    } as Logged;

    usuarioLogged = JSON.parse(localStorage.getItem(this.loginStorage));
    if (usuarioLogged!=null){
      this.usuarioAutenticado = usuarioLogged.codigo > 0 ;
      //recuperando o codigo do usuario.
      
      this.usuarioLogado.codigo = usuarioLogged.codigo ;
      this.usuarioLogado.login = usuarioLogged.login;
    }
    
    
 }
}
