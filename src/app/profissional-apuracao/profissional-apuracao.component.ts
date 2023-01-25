import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from "jspdf";
import 'jspdf-autotable'
import { EMPTY, of, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AgendaService } from '../agenda/agenda.service';
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

  colunas: string[] = [ "codigo", "data", "valor", "inicio", "fim", "total", "dataBaixa", "acao"];
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  inscricao$: Subscription;
  dataPesquisa: Date;
 
  
  public defaultSortColumn: string = "codigo";
  public defaultSortOrder: string = "desc";

  inscricaoProfissionalApuracaoDetalhe$: Subscription;
  inscricaoAgenda$: Subscription;
  inscricaoProfissional$ :Subscription;

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
    private agendaService: AgendaService,
    private alertService : AlertService,
    private profissionalService: ProfissionalService
    ) { }

  ngOnInit(): void {
    this.loadData();
    this.listaProfissionais();
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
                                                                            dataInicioAgenda = dataInicioAgenda.substring(8,10) + dataInicioAgenda.substring(4,7) + '-'+ dataInicioAgenda.substring(0,4) + ' ' + dataInicioAgenda.substring(11,19);
                                                                            dataTerminoAgenda = dataTerminoAgenda.substring(8,10) + dataTerminoAgenda.substring(4,7) + '-'+ dataTerminoAgenda.substring(0,4) + ' ' + dataTerminoAgenda.substring(11,19);
                                                                
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
    pdf.setTextColor(51, 156, 255);          
    pdf.text("" + title, 250,20);  //
    pdf.setLineWidth(1.5);
    pdf.line(5, 25, 995, 25)
    var pageContent = function (data) {
        // HEADER
       
        // FOOTER
        var str = "Page " + data.pageCount;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof pdf.putTotalPages === 'function') {
            str = str + " of " + totalPagesExp;
        }
        pdf.setFontSize(10);
        var pageHeight = pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();
        pdf.text(str, data.settings.margin.left, pageHeight - 10); // showing current page number
    };
    pdf.setFontSize(12);    
    let dataInicioPeriodo = profissionalApuracao.dataInicio.toLocaleString();
    let dataTerminoPeriodo = profissionalApuracao.dataFim.toLocaleString();   
    let dataApuracao = profissionalApuracao.dataApuracao.toLocaleString();
    let valorTotal = profissionalApuracao.valorTotal.toFixed(2);


    dataInicioPeriodo = dataInicioPeriodo.substring(8,10) + dataInicioPeriodo.substring(4,7) + '-'+ dataInicioPeriodo.substring(0,4);
    dataTerminoPeriodo = dataTerminoPeriodo.substring(8,10) + dataTerminoPeriodo.substring(4,7) + '-'+ dataTerminoPeriodo.substring(0,4);
    dataApuracao = dataApuracao.substring(8,10) + dataApuracao.substring(4,7) + '-'+ dataApuracao.substring(0,4) + ' ' + dataApuracao.substring(11,19);
        
    rowResumo.push(profissionalApuracao.codigo.toString());    
    rowResumo.push(profissional.nome);         
    rowResumo.push(dataInicioPeriodo);    
    rowResumo.push(dataTerminoPeriodo);
    rowResumo.push(valorTotal);
    rowResumo.push(dataApuracao);
    rowResumo.push(profissionalApuracao.usuario.nome);
    rowDResumo.push(rowResumo);

    pdf.autoTable(
        colResumo, 
        rowDResumo,
        {margin: { top: 30 },
        styles: {overflow: 'linebreak',
                fontSize: 9},
        showHeader: 'everyPage',
        });
   
    pdf.autoTable(col, rowD,
        {
            addPageContent: pageContent,
            margin: { top: 80 },                        
            styles: {overflow: 'linebreak',
                    fontSize: 7},
            showHeader: 'everyPage',
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
