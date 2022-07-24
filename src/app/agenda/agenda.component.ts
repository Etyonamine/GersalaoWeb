import { Component, OnInit } from '@angular/core';
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

  constructor(private empresaService : EmpresaService) { 
   
  }
 

  ngOnInit(): void {
      this.selected = new Date();
      this.recuperarDadosEmpresa();

  }
  ngOnDestroy():void{
    if (this.inscricaoEmpresa$){
      this.inscricaoEmpresa$.unsubscribe();
    }
  }
  
  recuperarDadosEmpresa(){
    this.inscricaoEmpresa$ = this.empresaService.recuperarDadosEmpresa()
                                                .subscribe(result=>{
                                    let empresaCriptografada = {
                                      codigo : atob(result.codigo),
                                      horaInicio: atob(result.horaInicio),
                                      horaTermino: atob(result.horaTermino),
                                      quantidadeMinutosServico: atob(result.quantidadeMinutosServico)
                                    } as Empresa;
                                    this.empresa = result;              
    },error=>{
      console.log(error);

    });
  }  
}


 