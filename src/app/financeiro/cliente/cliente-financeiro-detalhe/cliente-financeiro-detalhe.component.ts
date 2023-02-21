import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgendaServico } from 'src/app/agenda-servicos/agenda-servico';
import { AgendaServicosService } from 'src/app/agenda-servicos/agenda-servicos.service';
import { Cliente } from 'src/app/cliente/cliente';
import { ClienteService } from 'src/app/cliente/cliente.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { AgendaServicoPendente } from './agenda-servico-pendente';

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

  listaAgendaServico: AgendaServicoPendente[] = [];

  inscricaoCliente$:Subscription;
  inscricaoAgendaServico$: Subscription;

  allComplete: boolean = false;
  selection = new SelectionModel<AgendaServico>(true, []);

  constructor(private route: ActivatedRoute,
              private clienteService:ClienteService,
              private agendaServicoService: AgendaServicosService,
              private alertService: AlertService,
              private router: Router) { }
/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.listaAgendaServico.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  if (this.isAllSelected()) {
    this.selection.clear();
   // this.habilitarBotoes();
    return;
  }

  this.selection.select(...this.listaAgendaServico);
  
}

/** The label for the checkbox on the passed row */
checkboxLabel(row?: AgendaServico): string {
  if (!row) {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  //this.habilitarBotoes();
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.codigoServico + 1}`;  
}
 
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
                                                              result.forEach(servico=>{
                                                                this.listaAgendaServico.push({
                                                                  item : itemCorrente + 1,
                                                                  codigoAgenda: servico.codigoAgenda ,
                                                                   codigoProfissonal: servico.codigoProfissional, 
                                                                  codigoServico: servico.codigoServico,
                                                                  dataInicio: servico.agenda.dataInicio, 
                                                                  dataFim: servico.agenda.dataFim,                                                                 
                                                                  valorServico: servico.valorServico,
                                                                  nomeProfissional: servico.profissional.nome,
                                                                  descricaoServico: servico.servico.descricao
                                                                }as AgendaServicoPendente);
                                                              })
                                                              
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
