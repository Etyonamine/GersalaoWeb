import { AuthService } from './../auth-guard/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navegacao',
  templateUrl: './navegacao.component.html',
  styleUrls: ['./navegacao.component.scss']
})
export class NavegacaoComponent implements OnInit {
  mostrarMenu: boolean = false;
  
  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    this.authService.mostrarMenuEmitter
    .subscribe(
          mostrar =>{ this.mostrarMenu = mostrar}
      );
  }
  logout(){
    this.authService.fazerLogout();

  }


}
