import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from "jspdf";
import 'jspdf-autotable'
import { EMPTY, of, Subscription } from 'rxjs';
import { Empresa } from '../empresa/empresa';
import { EmpresaService } from '../empresa/empresa.service';
import { Profissional } from '../profissional/professional';
import { ProfissionalService } from '../profissional/profissional.service';
import { AlertService } from '../shared/alert/alert.service';
import { ApiResult } from '../shared/base.service';
import { ProfissionalApuracao } from './profissional-apuracao';
import { ProfissionalApuracaoDetalhe } from './profissional-apuracao-detalhe/profissional-apuracao-detalhe';
import { ProfissionalApuracaoDetalheService } from './profissional-apuracao-detalhe/profissional-apuracao-detalhe.service';
import { ProfissionalApuracaoService } from './profissional-apuracao.service';


@Component({
  selector: 'app-profissional-apuracao',
  templateUrl: './profissional-apuracao.component.html',
  styleUrls: ['./profissional-apuracao.component.scss']
})
export class ProfissionalApuracaoComponent implements OnInit, OnDestroy {

  colunas: string[] = [ "codigo", "data", "valor", "inicio", "fim", "total", "dataBaixa","situacaoPagto" ,"acao"];
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  inscricao$: Subscription;
  dataPesquisa: Date;
  empresa: Empresa;
  
  public defaultSortColumn: string = "codigo";
  public defaultSortOrder: string = "desc";

  inscricaoProfissionalApuracaoDetalhe$: Subscription;
  inscricaoAgenda$: Subscription;
  inscricaoProfissional$ :Subscription;
  inscricaoEmpresa$:Subscription;

  optionProfissionais: Profissional[]=[];
  listaProfissionaisCadastro: Profissional[];
  defaultFilterColumn: string = "dataApuracao";
  filterQuery: string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  listaApuracoes: MatTableDataSource<ProfissionalApuracao>;
  apuracoes: Array<ProfissionalApuracao> = [];
  listaApuracaoDetalhe: ProfissionalApuracaoDetalhe[] = [];

  constructor(private serviceAlert: AlertService,
    private profissionalApuracaoService: ProfissionalApuracaoService,
    private profisionalApuracaoDetalheService: ProfissionalApuracaoDetalheService,
    private alertService : AlertService,
    private profissionalService: ProfissionalService,
    private empresaService:EmpresaService
    ) { }

  ngOnInit(): void {
    this.loadData();
    this.listaProfissionais();
    this.recuperarInformacaoEmpresa();
  }
  ngOnDestroy(): void {
    if (this.inscricao$) { this.inscricao$.unsubscribe(); }
    if (this.inscricaoAgenda$) { this.inscricaoAgenda$.unsubscribe() }
    if (this.inscricaoProfissionalApuracaoDetalhe$) { this.inscricaoProfissionalApuracaoDetalhe$.unsubscribe() }
    if (this.inscricaoProfissional$ ){this.inscricaoProfissional$ .unsubscribe();}
  }
  clearDate(event) {
    event.stopPropagation();
    this.dataPesquisa = null;
    this.loadData();
  }
  recuperarInformacaoEmpresa(){
    this.inscricaoEmpresa$ = this.empresaService.recuperarDadosEmpresa()
                                                .subscribe(result=>{
                                                  this.empresa = result;
                                                },error=>{
                                                  console.log(error);
                                                  this.handleError('Ocorreu um erro ao recuperar dados da empresa');
                                                })
  }
  listaProfissionais(){
    this.inscricaoProfissional$ = this.profissionalService.listarProfissionaisApurados(undefined)
                                                          .subscribe(result=>{
                                                              this.listaProfissionaisCadastro = result;
                                                          },error=>{
                                                            console.log(error);
                                                            this.handleError('Ocorreu erro ao recuperar lista de profissionais do cadastro.');
                                                          });

    
  }
  loadData(query: string = null) {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterQuery = null;

    if (query !== null && query.toString().trim() !== '') {

      let dataPesq = new Date(query).toLocaleDateString();

      let novaData = dataPesq.substring(6, 10) + '-' + dataPesq.substring(3, 5) + '-' + dataPesq.substring(0, 2);
      this.filterQuery = novaData;
    }

    this.getData(pageEvent);

  }
  getData(event: PageEvent) {
    var sortColumn = (this.sort) ? this.sort.active : this.defaultSortColumn;
    var sortOrder = (this.sort) ? this.sort.direction : this.defaultSortOrder;
    var filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
    var filterQuery = (this.filterQuery) ? this.filterQuery : null;

    this.inscricao$ = this.profissionalApuracaoService.getData<ApiResult<any>>(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery
    ).subscribe(result => {
      
      this.listaApuracoes = new MatTableDataSource<ProfissionalApuracao>(result.data);
      
      this.paginator.length = result.totalCount;
      this.paginator.pageIndex = result.pageIndex;
      this.paginator.pageSize = result.pageSize;
    }, error => {
      console.error(error);
      if (error.status !== 404) {
        this.handleError('erro ao recuperar as informações de apuracão.');
      } else {
        return EMPTY;
      }
    });
  }
 
  handlerSucesso(mensagem: string) {
    this.serviceAlert.mensagemSucesso(mensagem);
  } 
  DownloadReport(codigoApuracao: number){
    let row : any[] = []
    let rowD : any[] = []
    let col=['cliente','inicio-agenda','termino-agenda','Serviço','valor-Servico (R$)','comissão(%)', 'valor-Comissão (R$)','origem-comissao']; // initialization for headers
    let title = "Extrato - Apuração" // title of report
    
    let apuracao = this.listaApuracoes.data.find(x=>x.codigo);
    this.inscricaoProfissional$= this.profissionalService.recuperarProfissionalApuracao(codigoApuracao)
                                                         .subscribe(profi=>{
                                                            if (profi!== null){                                                           
                                                                this.profisionalApuracaoDetalheService.get<ProfissionalApuracaoDetalhe[]>(codigoApuracao)    
                                                                .subscribe(result=>{
                                                                      //linhas da tabela
                                                                        if(result){
                                                                          result.forEach(detalhe=>{
                                                                            row=[]
                                                                            let agendaServico = detalhe.agendaServico;
                                                                
                                                                            let nomeCliente = agendaServico.agenda.cliente.nome;            
                                                                            let dataInicioAgenda = agendaServico.agenda.dataInicio.toLocaleString();
                                                                            let dataTerminoAgenda = agendaServico.agenda.dataFim.toLocaleString();
                                                                            let descricaoServico = agendaServico.servico.descricao;
                                                                            let valorServico = agendaServico.valorServico.toFixed(2);
                                                                            let valorComissao = agendaServico.valorServico * (agendaServico.valorPercentualComissao/100);
                                                                            let percentualComissao = agendaServico.valorPercentualComissao.toFixed(2);
                                                                            
                                                                            let descricaoOrigemComissao = agendaServico.codigoOrigemComissao == 1 ?  'Profissional': 'Serviço' ;
                                                                
                                                                            //tratando datas
                                                                            dataInicioAgenda = dataInicioAgenda.substring(8,10) + '/' + dataInicioAgenda.substring(5,7) + '/'+ dataInicioAgenda.substring(0,4) + ' ' + dataInicioAgenda.substring(11,19);
                                                                            dataTerminoAgenda = dataTerminoAgenda.substring(8,10) + '/' + dataTerminoAgenda.substring(5,7) + '/'+ dataTerminoAgenda.substring(0,4) + ' ' + dataTerminoAgenda.substring(11,19);
                                                                
                                                                            //adicionando a linha
                                                                            row.push(nomeCliente);
                                                                            row.push(dataInicioAgenda);
                                                                            row.push(dataTerminoAgenda);
                                                                            row.push(descricaoServico);
                                                                            row.push(valorServico);
                                                                            row.push(percentualComissao);
                                                                            row.push(valorComissao.toFixed(2));
                                                                            row.push(descricaoOrigemComissao);
                                                                            rowD.push(row);
                                                                          });
                                                                          
                                                                        }
                                                                        
                                                                        this.getReport(col , rowD , title, apuracao,profi );
                                                                    },error=>{
                                                                      console.log(error);
                                                                      this.handleError('Ocorreu erro ao gerar o extrato.');
                                                                    });

                                                            }
                                                         }, error=>{
                                                          console.log(error);
                                                          this.handleError('Ocorreu um erro ao tentar recuperar o profissional da apuracão.');
                                                         });
    
   
  }
 
  getReport(col: any[], rowD: any[], title: any, profissionalApuracao: ProfissionalApuracao, profissional : Profissional) {
    const totalPagesExp = "{total_pages_count_string}";        
    let pdf = new jsPDF('l', 'pt', 'a4');
    let colResumo = ['Codigo','Profissional','Início','Término','Valor Total (R$)', 'Apurado','Usuario']
    let rowDResumo : any[] = []
    let rowResumo : any[] = []
   


    /* 
    Preparação das informações  --------------------------------------------------------------------------------------------
    */
    let dataImpressao = new Date();
    let descricaoImpressa = 'gerado em: ' + dataImpressao.toLocaleString();

    let nomeEmpresa = atob(this.empresa.nomeAbreviado);
    //imagem do logo
    let imgLogo = new Image()
    imgLogo.src = '../../assets/images/logo.png'

    let dataInicioPeriodo = profissionalApuracao.dataInicio.toLocaleString();
    let dataTerminoPeriodo = profissionalApuracao.dataFim.toLocaleString();   
    let dataApuracao = profissionalApuracao.dataApuracao.toLocaleString();
    let valorTotal = profissionalApuracao.valorTotal.toFixed(2);


    dataInicioPeriodo = dataInicioPeriodo.substring(8,10) +'/'+ dataInicioPeriodo.substring(5,7) + '/'+ dataInicioPeriodo.substring(0,4);
    dataTerminoPeriodo = dataTerminoPeriodo.substring(8,10) +'/'+ dataTerminoPeriodo.substring(5,7) + '/'+ dataTerminoPeriodo.substring(0,4);
    dataApuracao = dataApuracao.substring(8,10) +'/' + dataApuracao.substring(5,7) + '/'+ dataApuracao.substring(0,4) + ' ' + dataApuracao.substring(11,19);
        
    rowResumo.push(profissionalApuracao.codigo.toString());    
    rowResumo.push(profissional.nome);         
    rowResumo.push(dataInicioPeriodo);    
    rowResumo.push(dataTerminoPeriodo);
    rowResumo.push(valorTotal);
    rowResumo.push(dataApuracao);
    rowResumo.push(profissionalApuracao.usuarioCadastro.nome);
    rowDResumo.push(rowResumo);

    /* 
    Configuração do report --------------------------------------------------------------------------------------------
    */     
    var pageContent = function (data) {
      // HEADER       
      pdf.setFontSize(18);
      pdf.setTextColor(40);     ''      
      pdf.text(nomeEmpresa, data.settings.margin.left, 20);//nome da empresa no cabecalho
      
      // FOOTER
      var str = "Página " + data.pageCount;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
         
          str = str + " de " + totalPagesExp;
      }
      var pageHeight = pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();
      pdf.setLineWidth(1.5);
      pdf.line(0, pdf.internal.pageSize.height-20, 995, pdf.internal.pageSize.height-20);
      pdf.setFontSize(10);            
      pdf.text(str, data.settings.margin.left, pageHeight - 10); // showing current page number
      pdf.text(descricaoImpressa,200, pageHeight -10);
  };

  //pdf.setTextColor(51, 156, 255);  azul claro        
  pdf.setTextColor(40); 
  pdf.text("" + title, 350,20);  //
  pdf.setLineWidth(1.5);
  pdf.line(5, 25, 995, 25);
  pdf.page=1; // use this as a counter.
  pdf.setFontSize(12);  
    pdf.autoTable(        
        colResumo, 
        rowDResumo,
        {
          columnStyles: {text: {columnWidth: 'auto'}},        
          margin: { top: 30 },          
          styles: {overflow: 'linebreak',
                fontSize: 9},
        showHeader: 'everyPage',
       
        });
   
    pdf.autoTable(col, rowD,
        {
            addPageContent: pageContent,
            margin: { top: 80 },                        
            styles: {overflow: 'linebreak',
                    fontSize: 8},            
            showHeader: 'everyPage' 
        });

    //for adding total number of pages // i.e 10 etc
    if (typeof pdf.putTotalPages === 'function') {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save(title + '.pdf');
  }
  handleError(msg:string){
    this.alertService.mensagemErro(msg);
  }
}
