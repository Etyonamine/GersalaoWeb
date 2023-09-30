import { AuthService } from './../auth-guard/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../menu/menu';
import { UsuarioPerfilMenuService } from '../usuario-perfil-menu/usuario-perfil-menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navegacao',
  templateUrl: './navegacao.component.html',
  styleUrls: ['./navegacao.component.scss']
})
export class NavegacaoComponent implements OnInit,OnDestroy {
  mostrarMenu = false;
  loginUsuario: string;
  inscricaoMenu$: Subscription;
  codigoPerfil: number;

  menus: Array<Menu>=[];

  constructor(private authService: AuthService,
              private router: Router,
              private usuarioPerfilMenuService: UsuarioPerfilMenuService) { }

  ngOnInit(): void {
    this.authService.mostrarMenuEmitter
    .subscribe(
          mostrar =>
          {
            this.mostrarMenu = mostrar;

            if (this.mostrarMenu) {
              this.getUserLogged();
               
              this.recuperarListaMenu( this.codigoPerfil);
            }
          }
      );

  }
  ngOnDestroy(): void {
    if (this.inscricaoMenu$){
      this.inscricaoMenu$.unsubscribe();
    }
  }
  logout() {
    this.authService.fazerLogout();

  }
  getUserLogged() {

    this.authService.getUserData();    
    this.loginUsuario = this.authService.usuarioLogado.login;
    this.codigoPerfil = Number.parseInt(this.authService.usuarioLogado.codigoUsuarioPerfil);

  }
  recuperarListaMenu(codigoPerfil: number){
    this.inscricaoMenu$ = this.usuarioPerfilMenuService.listarMenuPorPefil(codigoPerfil)
                                                       .subscribe(result=>{
                                                        this.menus = result;
                                                       },
                                                       error=>{
                                                        console.log(error);                                                        
                                                       })
  }
}
