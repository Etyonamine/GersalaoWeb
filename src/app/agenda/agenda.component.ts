import { removeSummaryDuplicates } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { unwatchFile } from 'fs';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth-guard/auth.service';
import { Empresa } from '../empresa/empresa';
import { EmpresaService } from '../empresa/empresa.service';
import { Profissional } from '../profissional/professional';
import { ProfissionalService } from '../profissional/profissional.service';
import { AlertService } from '../shared/alert/alert.service';
import { ApiResult } from '../shared/base.service';
import { Agenda } from './agenda';
import { AgendaBaixa } from './agenda-baixa';
import { AgendaBaixaComponent } from './agenda-baixa/agenda-baixa.component';
import { AgendaService } from './agenda.service';

export interface AgendaDia{
  codigoProfissional:number;
  listaAgenda: Array<Agenda>;
}
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
  codigoUsuario: number;
  selected: Date | null;
  empresa: Empresa;
  horarios: Array<string> = ["08:00", "08:30", "09:00", "09:30"];
  
  listaProfissionais: Array<Profissional>=[];
  listaAgenda: MatTableDataSource<Agenda>;
  qtdeColunasProfissionais: number;
  qtdeAgendas : number;

  listaLinksAgenda:Array<string>=[];
  listaAgendasDia: Array<AgendaDia>=[];

  inscricaoAngenda$: Subscription;
  inscricaoEmpresa$: Subscription;
  inscricaoProfissional$: Subscription;

  constructor(
    private agendaService: AgendaService,
    private empresaService: EmpresaService,
    private profissionalService: ProfissionalService,
    private authService:AuthService,
    private alertService: AlertService,
    public dialog: MatDialog    
    ) {

  }


  ngOnInit(): void {
   
    this.selected =  new Date();
    this.recuperarDadosEmpresa();
    this.empresa = {} as Empresa;
    this.obterProfissionais();
    this.qtdeColunasProfissionais = 1;
    this.qtdeAgendas = 0;
    this.obterAgendas();
    this.codigoUsuario = Number.parseInt(this.authService.usuarioLogado.codigo);
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
                                                  this.montarAgendaDia();
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
  montarAgendaDia(){
    //limpando a lista
    this.listaAgendasDia.splice(0,this.qtdeColunasProfissionais); 

    /* this.listaLinksAgenda = ['Nenhum agendamento','Nenhum agendamento', 'Nenhum agendamento'];  */    

     let strLinks : string;          
     let contadorAgenda: number;
     
     //montando
     if (this.qtdeAgendas > 0 && this.listaAgenda.data.length > 0  ){
       
       //percorrendo a lista de profissionais
        this.listaProfissionais.forEach(profi=>{           
          
          let agendas = this.listaAgenda.data.filter(x=>x.codigoProfissional === profi.codigo);
            agendas.sort(function(a,b){return new Date(a.dataAgendaString).getDate() - new Date(b.dataAgendaString).getDate()});
                                              

          this.listaAgendasDia.push({codigoProfissional : profi.codigo, listaAgenda : agendas });
                        
      });
    }      
  }
  openDialogBaixa(codigo:number){
    this.inscricaoAngenda$ = this.agendaService.get<Agenda>(codigo)
                                               .subscribe(result=>{
                                                if (result){
                                                  
                                                  let agendaBaixa = {
                                                    codigo : result.codigo,
                                                    data : result.data,
                                                    dataString: result.dataAgendaString,
                                                    hora : result.horaAgendaString,                                                    
                                                    nomeCliente : result.cliente.nome,
                                                    nomeProfissional : result.profissional.nome,
                                                    descricaoServico : result.servico.descricao,
                                                    valorServico : result.valorServico,
                                                    valorDesconto: result.valorDesconto, 
                                                    valorAcrescimo: result.valorAcrescimo,
                                                    valorComissao: result.valorComissaoPercentual,
                                                    observacao: result.observacao,
                                                    observacaoBaixa: result.observacaoBaixa                                                   ,
                                                    codigoUsuarioAlteracao: this.codigoUsuario,
                                                    situacaoBaixado : result.codigoSituacaoBaixa === 5 ? false:true
                                                  
                                                    
                                                  } as AgendaBaixa;

                                                  const dialogRef = this.dialog.open(AgendaBaixaComponent,
                                                    { width: '800px' ,
                                                      height: '900px;',
                                                      data : agendaBaixa }
                                                  );

                                                  dialogRef.afterClosed().subscribe(retornoDialog => {
      
                                                    this.obterAgendas();
                                                  });
                                                 
                                                }else{
                                                  this.handleError('Não foi encontrado este agendamento!');
                                                  return ;
                                                }
                                               }, error=>{
                                                console.log(error);
                                                this.handleError('Ocorreu um erro ao recuperar o agendamento.');
                                               });

     
    
 
    
                                                
                                               
  }
}


