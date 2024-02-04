import { AuthService } from './../auth-guard/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navegacao',
  templateUrl: './navegacao.component.html',
  styleUrls: ['./navegacao.component.scss']
})
export class NavegacaoComponent implements OnInit {
  mostrarMenu = false;
  loginUsuario: string;


  constructor(private authService: AuthService,
              private router: Router,) { }

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
    this.loginUsuario = this.authService.usuarioLogado.login;

  }

}
