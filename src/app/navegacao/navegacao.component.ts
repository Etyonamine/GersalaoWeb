import { AuthService } from './../auth-guard/auth.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navegacao',
  templateUrl: './navegacao.component.html',
  styleUrls: ['./navegacao.component.scss']
})
export class NavegacaoComponent implements OnInit {
  mostrarMenu = false;
  codigoUsuario = 0;
  loginUsuario: string;


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.mostrarMenuEmitter
    .subscribe(
          mostrar =>
          {
            this.mostrarMenu = mostrar;

            if (this.mostrarMenu) {
              this.getUserLogged();
            }
          }
      );

  }
  logout() {
    this.authService.fazerLogout();

  }
  getUserLogged() {

    this.authService.getUserData();
    this.codigoUsuario = this.authService.usuarioLogado.Codigo;
    this.loginUsuario = this.authService.usuarioLogado.Login;

  }

}
