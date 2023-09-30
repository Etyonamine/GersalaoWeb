import { Component, Input } from '@angular/core';
import { AuthService } from './auth-guard/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {


  title = 'Portal YTS-Hair';
  ano: Date;


  constructor(private authService:AuthService ){

  }
  ngOnInit(){


    this.ano = new Date();

  }
}
