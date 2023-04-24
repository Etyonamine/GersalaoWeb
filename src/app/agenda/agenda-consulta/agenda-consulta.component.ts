import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AnyARecord } from 'dns';
import { Subscription } from 'rxjs';
import { AgendaServico } from 'src/app/agenda-servicos/agenda-servico';
import { AgendaServicosService } from 'src/app/agenda-servicos/agenda-servicos.service';
import { Cliente } from 'src/app/cliente/cliente';
import { ClienteService } from 'src/app/cliente/cliente.service';
import { Profissional } from 'src/app/profissional/professional';
import { ProfissionalService } from 'src/app/profissional/profissional.service';
import { Servico } from 'src/app/servico/servico';
import { ServicosService } from 'src/app/servico/servicos.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { AgendaService } from '../agenda.service';
import { AgendaConsultaIn } from './agenda-consulta-in';


@Component({
  selector: 'app-agenda-consulta',
  templateUrl: './agenda-consulta.component.html',
  styleUrls: ['./agenda-consulta.component.scss']
})
export class AgendaConsultaComponent implements OnInit, OnDestroy {

  codigoCliente: number;
  codigoProfissional: number;
  codigoServico: number;

  inscricao$: Subscription;
  inscricaoProfissional$: Subscription;

  listaAgendaServicos: AgendaServico[] =[];
  listaClientes: Cliente[] = [];
  listaProfissionais: Profissional[] = [];
  listaServicos: Servico[] =[];

  periodoInicio: Date;
  periodoFim: Date;

  lista: MatTableDataSource<AgendaServico>;
  colunas: string[] = ["nomeCliente", "nomeProfissional", "inicio","fim","servico"];
  public defaultSortColumn: string = "agenda.cliente.nomeCliente";
  public defaultSortOrder: string = "asc";
  defaultFilterColumn: string = "NomeCliente";
  
  @ViewChild(MatSort) sort: MatSort;

  dadosOrdenados: AgendaServico[];

  constructor(private clienteService: ClienteService,
              private agendaService: AgendaService,
              private agendaServicoService: AgendaServicosService,
              private alertService: AlertService,
              private profisisonalService: ProfissionalService,
              private servicoService: ServicosService) { }

  //variaveis do periodo ----------------
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  //-------------------------------------
  ngOnInit(): void {
    this.iniciarRange();
    this.codigoCliente = 0;   
    this.codigoProfissional =0;
    this.codigoServico =0 ;

    this.listarClientes();
    this.listarProfissionais();
    this.listarServicos();
    this.pesquisarAgendas();
  }
  ngOnDestroy(): void {
    if (this.inscricao$) {
      this.inscricao$.unsubscribe();
    }
    if (this.inscricaoProfissional$){
      this.inscricaoProfissional$.unsubscribe();
    }
  }
  iniciarRange(){
    let dataAtual = new Date();
    let dataFim = new Date();
    dataAtual.setDate(dataAtual.getDate() - 7);
    this.range.controls['start'].setValue(dataAtual);
    this.range.controls['end'].setValue(dataFim);
  } 
  getRange() {
    let periodo = this.range.value;
    this.periodoInicio = periodo.start;
    this.periodoFim = periodo.end;
  }
  alteracaoPeriodo(){
    this.listarClientes();
    this.codigoCliente =0;
    this.codigoProfissional =0 ;
    this.codigoServico = 0;
    this.listaAgendaServicos.splice(0,this.listaAgendaServicos.length);
  
  }
  listarClientes() {
    this.getRange();
    this.listaClientes.slice(0,this.listaClientes.length-1);
    if( this.periodoInicio > this.periodoFim){
      this.handlerError('Atenção!Período informado incorreto!A data de fim está menor do que o início.');
      return false;
    }
    this.inscricao$ = this.agendaService.getClientes(this.periodoInicio, this.periodoFim)
      .subscribe(result => {
        if (result.length ==0){
          this.handlerInformacao('Atenção!Não existe agendas para o período!');          
        }
        this.listaClientes = result;
      })
  }
  listarProfissionais(){
    this.inscricaoProfissional$ = this.profisisonalService.getAll()
                                                          .subscribe(result=>{
                                                            this.listaProfissionais  = result;
                                                          });
  }
  listarServicos(){
    this.inscricao$ = this.servicoService.getAll()
                          .subscribe(result=>{
                              this.listaServicos = result;
                          },error=>{
                            this.handlerError('Ocorre um erro ao tentar recuperar a lista de serviços');
                          })
  }
  ordenarDados(sort: Sort) {
    const data = this.listaAgendaServicos.slice();
    if (!sort.active || sort.direction === '') {
      this.listaAgendaServicos = data;
      return;
    }

    this.listaAgendaServicos = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomeCliente': return compare(a.agenda.cliente.nome, b.agenda.cliente.nome, isAsc);
        case 'nomeProfissional': return compare(a.profissional.nome, b.profissional.nome, isAsc);        
        case 'inicio': return compare(a.agenda.dataInicio, b.agenda.dataInicio, isAsc);        
        case 'fim': return compare(a.agenda.dataFim, b.agenda.dataFim, isAsc);        
        case 'servico': return compare(a.servico.descricao, b.servico.descricao, isAsc);        
        default: return 0;
      }
    });
  }

  pesquisarAgendas(query: string = null){
    this. getRange() ;
    let parametros = {
      codigoCliente : this.codigoCliente, 
      codigoProfissional : this.codigoProfissional,
      codigoServico: this.codigoServico,
      inicio : this.periodoInicio,
      fim : this.periodoFim
    }as AgendaConsultaIn;
    this.inscricao$ = this.agendaServicoService.consultaAgendas(parametros)
                                                .subscribe(result=>{                                                   
                                                   this.listaAgendaServicos = result;
                                                   this.lista = new MatTableDataSource<AgendaServico>(result);                                                   
                                                   if (this.listaAgendaServicos.length === 0){
                                                    this.handlerInformacao('Não foi encontrado nenhuma agenda!');
                                                   }
                                                },error =>{
                                                  console.log(error);
                                                  this.handlerError('Ocorreu um erro ao pesquisar as agendas.');
                                                })
  }
  limparFiltros(){
    this.codigoCliente =0;
    this.codigoProfissional =0 ;
    this.codigoServico = 0;
    this.iniciarRange();
    this.listaAgendaServicos.splice(0,this.listaAgendaServicos.length);
    this.pesquisarAgendas();
  } 
  handlerInformacao(message: string){
    return this.alertService.mensagemExclamation(message);
  }
  handlerError(message:string){
    return this.alertService.mensagemErro(message);
  }
}
function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}