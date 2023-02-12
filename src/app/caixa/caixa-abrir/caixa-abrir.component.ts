import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/shared/alert/alert.service';

@Component({
  selector: 'app-caixa-abrir',
  templateUrl: './caixa-abrir.component.html',
  styleUrls: ['./caixa-abrir.component.scss']
})
export class CaixaAbrirComponent implements OnInit {
 
   
  constructor(private alertService:AlertService ) { }

  ngOnInit(): void {
     
  }
   
  handleError(msg:string){
    this.alertService.mensagemErro(msg);
  }
}
