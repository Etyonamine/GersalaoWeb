import { Component, Input } from '@angular/core';
import { AuthService } from './auth-guard/auth.service';
import { Usuario } from './usuario/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {


  title = 'Portal Gersalão';
  ano: Date;
  

  constructor(private authService:AuthService ){

  }
  ngOnInit(){


    this.ano = new Date();

  }
}
