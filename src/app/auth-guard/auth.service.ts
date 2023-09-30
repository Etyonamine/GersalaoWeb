import { AlertService } from './../shared/alert/alert.service';
import { LoginService } from './../login/login.service';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from './../login/login';
import { Logged } from '../login/logged.component';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usuarioPesquisado: Login;
  usuarioLogado: Logged = {
    codigo : "0",
    login: '',
    codigoUsuarioPerfil:"0"
  };

  tokenStorage: string ='tokenAuthentic';
  loginStorage: string = 'loginAuthentic';

  usuarioAutenticado = false;
  mostrarMenuEmitter = new EventEmitter<boolean>();
  Codigo : number; 
  token : string;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private alertService: AlertService
  ) {}

  removerLoginArmazenado(){
    localStorage.removeItem(this.loginStorage);
    localStorage.removeItem(this.tokenStorage);
  }
  fazerLogin(usuario: Login) {

    const login =  { login: usuario.login, senha: usuario.senha , Autenticado : usuario.Autenticado} as Login;
    this.mostrarMenuEmitter.emit(false);
    // pesquisando na base de dados
    this.loginService.validarLogin(login)
                      .subscribe(resposta => {
                                  if (resposta!== null)
                                  {   
                                      let usuarioStorage = {
                                                            codigo : resposta.codigo,
                                                            login : resposta.login,
                                                            codigoUsuarioPerfil : resposta.codigoUsuarioPerfil
                                                          } as Logged;

                                      localStorage.setItem(this.tokenStorage, JSON.stringify(resposta.tokenAutorizacao));                                      
                                      localStorage.setItem(this.loginStorage, JSON.stringify(usuarioStorage));          
                                               
                                       
                                      this.mostrarMenuEmitter.emit(true);
                                      this.usuarioAutenticado = true;
                                      this.router.navigate(['/home']); 
                                  }else{
                                    this.alertService.mensagemExclamation('Usuario ou senha inválido!');
                                  }     
                                }, error => {
                                    console.error(error.error);
                                    if (error.status == "404"){
                                      this.alertService.mensagemExclamation('Usuario ou senha inválido!');
                                    }else{
                                      this.alertService.mensagemErro('Ocorreu um erro ao tentar validar o seu acesso!');
                                    }                                
                                    
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
    this.usuarioLogado = {} as Logged;
    this.mostrarMenuEmitter.emit(false);
    this.router.navigate(['/login']);
    
  }

  getUserData() {

    
    let loginStorage : Login = localStorage.getItem(this.loginStorage)?
                          JSON.parse(localStorage.getItem(this.loginStorage)):null;
    if (loginStorage!=null){
      this.usuarioAutenticado = this.getObterTokenUsuario() ;      
      this.usuarioLogado.login = atob(loginStorage.login);      
      this.usuarioLogado.codigo = atob(loginStorage.codigo);
      this.usuarioLogado.codigoUsuarioPerfil =atob(loginStorage.codigoUsuarioPerfil);
    }    
 }
 getObterTokenUsuario()
 {
    return localStorage.getItem(this.tokenStorage) ? true : false;
 }
 recuperarToken(){
  this.token = localStorage.getItem(this.tokenStorage) ? JSON.parse(atob(localStorage.getItem(this.tokenStorage)))  : null;
  
 }
}
