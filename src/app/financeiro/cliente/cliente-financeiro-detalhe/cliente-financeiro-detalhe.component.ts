import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgendaServicosService } from 'src/app/agenda-servicos/agenda-servicos.service';
import { Cliente } from 'src/app/cliente/cliente';
import { ClienteService } from 'src/app/cliente/cliente.service';
import { AlertService } from 'src/app/shared/alert/alert.service';

@Component({
  selector: 'app-cliente-financeiro-detalhe',
  templateUrl: './cliente-financeiro-detalhe.component.html',
  styleUrls: ['./cliente-financeiro-detalhe.component.scss']
})
export class ClienteFinanceiroDetalheComponent implements OnInit, OnDestroy {
  codigoCliente: number;
  cliente : Cliente;
  quantidade: number;
  valorTotalPendente: number;

  inscricaoCliente$:Subscription;
  inscricaoAgendaServico$: Subscription;

  constructor(private route: ActivatedRoute,
              private clienteService:ClienteService,
              private agendaServicoService: AgendaServicosService,
              private alertService: AlertService) { }

  ngOnInit(): void {
   this.codigoCliente =  this.route.snapshot.data['codigo'];
   this.recuperarInformacaoCliente();
   this.quantidade =0;
   this.valorTotalPendente =0;
  }
  ngOnDestroy(): void {
    if(this.inscricaoCliente$){
      this.inscricaoCliente$.unsubscribe();
    }
    if (this.inscricaoAgendaServico$){
      this.inscricaoAgendaServico$.unsubscribe();
    }
  }
  recuperarInformacaoCliente(){
    this.inscricaoCliente$ = this.clienteService.get<Cliente>(this.codigoCliente)
                                                .subscribe(result=>{
                                                  this.cliente = result;
                                                },error=>{
                                                  console.log(error);
                                                  this.handlerError('Ocorreu um erro ao tentar recuperar informações do cliente.');
                                                })
  }
  recuperarListaAgendaServicoPendentes(){
    
  }
  handlerError(message:string){
    return this.alertService.mensagemErro(message);
  }
}
