import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Empresa } from '../empresa/empresa';
import { EmpresaService } from '../empresa/empresa.service';
import { Profissional } from '../profissional/professional';
import { ProfissionalService } from '../profissional/profissional.service';
import { AlertService } from '../shared/alert/alert.service';
import { ApiResult } from '../shared/base.service';
import { Agenda } from './agenda';
import { AgendaService } from './agenda.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {

  selected: Date | null;
  empresa: Empresa;
  horarios: Array<string> = ["08:00", "08:30", "09:00", "09:30"];

  listaProfissionais: Array<Profissional>=[];
  listaAgenda: MatTableDataSource<Agenda>;
  qtdeColunasProfissionais: number;
  qtdeAgendas : number;

  listaLinksAgenda:Array<string>=[];

  inscricaoAngenda$: Subscription;
  inscricaoEmpresa$: Subscription;
  inscricaoProfissional$: Subscription;

  constructor(
    private agendaService: AgendaService,
    private empresaService: EmpresaService,
    private profissionalService: ProfissionalService,
    private alertService: AlertService,
    private router: Router) {

  }


  ngOnInit(): void {
    this.selected = new Date();
    this.recuperarDadosEmpresa();
    this.empresa = {} as Empresa;
    this.obterProfissionais();
    this.qtdeColunasProfissionais = 1;
    this.qtdeAgendas = 0;
    this.obterAgendas();
  }
  ngOnDestroy(): void {
    if (this.inscricaoEmpresa$) {
      this.inscricaoEmpresa$.unsubscribe();
    }
    if (this.inscricaoProfissional$) {
      this.inscricaoProfissional$.unsubscribe();
    }
    if (this.inscricaoAngenda$){
      this.inscricaoAngenda$.unsubscribe();
    }
  }
  obterProfissionais() {

    this.inscricaoProfissional$ = this.profissionalService.ListarProfissionais()
      .subscribe(result => {
        result.forEach(profi => {
          this.listaProfissionais.push({
            codigo: Number.parseInt(atob(profi.codigo)),
            nome: atob(profi.nome)         
          } as Profissional);
          
        }, error => {
          console.log(error);
          this.handleError('Ocorreu um erro ao recuperar a lista de profissionais.');
        });
        if (result){
          this.qtdeColunasProfissionais = result.length;
        }
      });
  }
  obterAgendas(){
    let pageIndex: number = 0;
    let pageSize: number = 100;
    let sortColumn: string = 'nomeProfissional';
    let sortOrder : string = 'ASC';
    let filterColumn: string  = 'dataAgendaString';
    let filterQuery: string  = this.selected.toJSON().substring(0,10);
    
    this.inscricaoAngenda$ = this.agendaService.getData<ApiResult<any>>(pageIndex,pageSize,sortColumn,sortOrder, filterColumn, filterQuery)
                                               .subscribe(result=>{
                                                  this.listaAgenda =  new MatTableDataSource<Agenda>(result.data);
                                                  this.qtdeAgendas = result.totalCount;
                                                  this.montarLinks();
                                               },error=>{
                                                console.log(error);
                                                this.handleError('ocorreum erro ao tentar recuperar as agendas!');
                                               });
  }
  recuperarDadosEmpresa() {

        this.inscricaoEmpresa$ = this.empresaService.recuperarDadosEmpresa()
          .subscribe(result => {
            this.empresa.codigo = atob(result.codigo);
            this.empresa.horaInicial = atob(result.horaInicial);
            this.empresa.horaFim = atob(result.horaFim);
            this.empresa.quantidadeMinutosServico = atob(result.quantidadeMinutosServico);



          }, error => {
            console.log(error);

          });
      }
  handlerSucesso(mensagem: string) {
        this.alertService.mensagemSucesso(mensagem);
      }
  handleError(mensagem: string) {
        this.alertService.mensagemErro(mensagem);
      }
  montarLinks(){
    //modelo padrao. 
     this.listaLinksAgenda = ['Nenhum agendamento','Nenhum agendamento', 'Nenhum agendamento'];     
     let strLinks : string;          
     let contadorAgenda: number;
     //montando
     if (this.qtdeAgendas > 0 && this.listaAgenda.data.length > 0  ){
        this.listaLinksAgenda.splice(0,3);
       //percorrendo a lista de profissionais
        this.listaProfissionais.forEach(profi=>{
          strLinks ='Nenhum agendamento';
          contadorAgenda = 1;

          this.listaAgenda.data.filter(x=>x.codigoProfissional === profi.codigo).forEach(agenda=>{
            if (contadorAgenda == 1){
              strLinks ='<a>' +  contadorAgenda.toString().padStart(2,'0') +' - ' +               agenda.data.toString().substring(11,16)  +  ' - ' +               agenda.cliente.nome + '</a><br />';
            }else{
              strLinks +='<a [routerLink]=[agenda-novo,'  + agenda.codigo.toString() + ']>' +
                      contadorAgenda.toString().padStart(2,'0') +' - ' + 
                      agenda.data.toString().substring(11,16) +  ' - ' + 
                      agenda.cliente.nome + '</a><br />'
            }
            
                      
            contadorAgenda++;
          });         
          this.listaLinksAgenda.push(strLinks) ;
          console.log(strLinks);
        });
     }      
  }
}


