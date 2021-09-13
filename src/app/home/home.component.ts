import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Login } from '../login/login';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  codigo:number;
  nome:string; 

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
      
     
     this.route.params.subscribe((params: Params) => {
              this.codigo = params['codigo'];
              this.nome = params['nome'];
            });
  }

}
