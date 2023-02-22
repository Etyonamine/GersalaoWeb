import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgendaServico } from 'src/app/agenda-servicos/agenda-servico';
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

  colunas : string[] =  ["codigoAgenda", "dataInicio", "dataFim","profissionalNome","descricaoServico", "valorServico", "acao"];
  public defaultSortColumn: string = "codigoAgenda";
  public defaultSortOrder: string = "asc";

  listaAgendaServico: AgendaServico[] = [];

  inscricaoCliente$:Subscription;
  inscricaoAgendaServico$: Subscription;

  allComplete: boolean = false;
  selection = new SelectionModel<AgendaServico>(true, []);

  constructor(private route: ActivatedRoute,
              private clienteService:ClienteService,
              private agendaServicoService: AgendaServicosService,
              private alertService: AlertService,
              private router: Router) { }

  ngOnInit(): void {
   this.codigoCliente =  this.route.snapshot.data['codigo'];
   this.recuperarInformacaoCliente();   
   this.quantidade =0;
   this.valorTotalPendente =0;
   this.recuperarListaAgendaServicoPendentes();
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
    let itemCorrente : number = 1;

    this.inscricaoAgendaServico$ = this.agendaServicoService.listarServicosPendentes(this.codigoCliente)
                                                            .subscribe(result=>{
                                                              this.listaAgendaServico = result;
                                                              
                                                              this. calcularTotal();
                                                            });      
  }
  calcularTotal(){
    if (this.listaAgendaServico ==undefined){
      return false;
    }
    this.valorTotalPendente = 0;
    this.quantidade = 0;
    
    this.listaAgendaServico.forEach(agendaServico=>{
      this.valorTotalPendente = this.valorTotalPendente +  agendaServico.valorServico;
      this.quantidade = this.quantidade + 1;
    });
  }
  handlerError(message:string){
    return this.alertService.mensagemErro(message);
  }
  retornar(){
    this.router.navigate(['cliente-financeiro']);
  }
}
