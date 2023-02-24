import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Cliente } from 'src/app/cliente/cliente';
import { ClienteService } from 'src/app/cliente/cliente.service';
import { AlertService } from 'src/app/shared/alert/alert.service';

@Component({
  selector: 'app-agenda-consulta',
  templateUrl: './agenda-consulta.component.html',
  styleUrls: ['./agenda-consulta.component.scss']
})
export class AgendaConsultaComponent implements OnInit, OnDestroy {

  codigoCliente: number;
  inscricao$: Subscription;
  listaClientes: Cliente[] = [];
  constructor(private clienteService: ClienteService,
              private alertService: AlertService) { }

  //variaveis do periodo ----------------
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  //-------------------------------------
  ngOnInit(): void {
    this.codigoCliente = 0;
    this.listarClientes();
  }
  ngOnDestroy(): void {
    if (this.inscricao$) {
      this.inscricao$.unsubscribe();
    }
  }
  listarClientes() {
    this.inscricao$ = this.clienteService.getAll()
      .subscribe(result => {
        this.listaClientes = result;
      })
  }
  teste(){
    let periodo = this.range.value;
    let inicio = periodo.start;
    let fim = periodo.end;


    this.handlerInformacao(inicio);
    setTimeout(() => {
      this.handlerInformacao(fim);  
    }, 3000);
    
  }
  handlerInformacao(message: string){
    return this.alertService.mensagemExclamation(message);
  }

}
