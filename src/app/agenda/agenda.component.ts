import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Empresa } from '../empresa/empresa';
import { EmpresaService } from '../empresa/empresa.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
  
  selected: Date | null;
  empresa: Empresa; 
  horarios:Array<string>=["08:00","08:30","09:00","09:30"];

  inscricaoEmpresa$:Subscription;

  constructor(private empresaService : EmpresaService,
              private router: Router) { 
   
  }
 

  ngOnInit(): void {
      this.selected = new Date();
      this.recuperarDadosEmpresa();
      this.empresa = {}as Empresa;
       
  }
  ngOnDestroy():void{
    if (this.inscricaoEmpresa$){
      this.inscricaoEmpresa$.unsubscribe();
    }
  }
  
  recuperarDadosEmpresa(){

    this.inscricaoEmpresa$ = this.empresaService.recuperarDadosEmpresa()
                                                .subscribe(result=>{                                  
                                    this.empresa.codigo = atob(result.codigo);              
                                    this.empresa.horaInicial = atob(result.horaInicial);              
                                    this.empresa.horaFim = atob(result.horaFim);              
                                    this.empresa.quantidadeMinutosServico = atob(result.quantidadeMinutosServico);              

                                   
                                  
    },error=>{
      console.log(error);

    });
  }
   
}


 