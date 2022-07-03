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
                     .pipe(concatMap(retorno =>
      {
      
        let usuarioEncontrado = {} as Usuario;
        if (retorno)
        {
          this.usuarioService.get<Usuario>(login.login)
                             .subscribe(usuario=>{
                                        usuarioEncontrado = usuario;
                                        let usuarioLogged = { 
                                                              codigo : usuarioEncontrado.codigo,                                  
                                                              login : usuarioEncontrado.login }  as Logged;
                                        
                                        localStorage.setItem('user_logged', JSON.stringify(usuarioLogged));          
                                        this.mostrarMenuEmitter.emit(true);
                                        this.router.navigate(['/home']);
              
          }, error=>{
            console.log(error);
            this.alertService.mensagemErro('Erro ao recuperar as informações do usuário!');
            return of (false);
          });                
          return of (true);
        }        
        else{
          return of (false);
        }        
      
    })).subscribe(
      (retorno) => {
        if (!retorno) {                 
          this.alertService.mensagemErro('Usuário ou senha inválido!');  
          return false;
        }else{
          
              return true;
        }
      },
      (error) => {
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
    localStorage.removeItem('user_logged');
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

    usuarioLogged = JSON.parse(localStorage.getItem('user_logged'));
    if (usuarioLogged!=null){
      this.usuarioAutenticado = usuarioLogged.codigo > 0 ;
      //recuperando o codigo do usuario.
      
      this.usuarioLogado.codigo = usuarioLogged.codigo ;
      this.usuarioLogado.login = usuarioLogged.login;
    }
    
    
 }
}
