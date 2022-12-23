import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from "jspdf";
import 'jspdf-autotable'
import { EMPTY, of, Subscription } from 'rxjs';
import { AgendaService } from '../agenda/agenda.service';
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

  colunas: string[] = ["nome", "codigo", "data", "valor", "inicio", "fim", "total", "dataBaixa", "acao"];
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  inscricao$: Subscription;
  dataPesquisa: Date;

  public defaultSortColumn: string = "CodigoProfissional";
  public defaultSortOrder: string = "desc";

  inscricaoProfissionalApuracaoDetalhe$: Subscription;
  inscricaoAgenda$: Subscription;


  defaultFilterColumn: string = "CodigoProfissional";
  filterQuery: string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  listaApuracoes: MatTableDataSource<ProfissionalApuracao>;
  apuracoes: Array<ProfissionalApuracao> = [];
  constructor(private serviceAlert: AlertService,
    private profissionalApuracaoService: ProfissionalApuracaoService,
    private profisionalApuracaoDetalheService: ProfissionalApuracaoDetalheService,
    private agendaService: AgendaService
    ) { }

  ngOnInit(): void {
    this.loadData();
    

  }
  ngOnDestroy(): void {
    if (this.inscricao$) { this.inscricao$.unsubscribe(); }
    if (this.inscricaoAgenda$) { this.inscricaoAgenda$.unsubscribe() }
    if (this.inscricaoProfissionalApuracaoDetalhe$) { this.inscricaoProfissionalApuracaoDetalhe$.unsubscribe() }
  }
  clearDate(event) {
    event.stopPropagation();
    this.dataPesquisa = null;
    this.loadData();
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
      this.apuracoes = result.data;
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
  apagarApuracao(codigoApuracao: number) {

    this.serviceAlert.openConfirmModal('Por favor, confirmar se deseja excluir a apuração?',
      'Apuração - Profissional', (resposta: boolean) => {
        if (resposta) {

          let apuracao = this.listaApuracoes.data.find(x => x.codigo == codigoApuracao);

          let codigosAgenda: Array<number> = [];

          if (apuracao !== null) {
            //recuperar a lista de codigos de agendas
            this.profisionalApuracaoDetalheService.get<Array<ProfissionalApuracaoDetalhe>>(codigoApuracao).subscribe(listaAgendas => {
              listaAgendas.forEach(agenda => {
                codigosAgenda.push(agenda.codigoAgenda);
              });

              if (codigosAgenda.length>0) {
                //excluir as agendas do detalhe
                this.profisionalApuracaoDetalheService.delete(codigoApuracao).subscribe(exclusaoDetalhe => {

                  if (exclusaoDetalhe) {
                    //excluir a apuracao
                    this.profissionalApuracaoService.delete(codigoApuracao).subscribe(exclusaoApuracao => {
                      if (exclusaoApuracao) {

                        //alterar para o status de apurar na agenda.
                        this.agendaService.alterarStatusPendenteApuracao(codigosAgenda).subscribe(alteracao => {
                          if (alteracao) {
                            this.handlerSucesso('Apuração apagada com sucesso!');
                            setTimeout(() => {
                              this.loadData();
                              return of(true);
                            }, 3000);
                          }
                        }, error => {
                          console.log(error);
                          this.handleError('Ocorreu erro ao tentar alterar o status das agendas da apuração.');
                        });

                      }
                    }, error => {
                      console.log(error);

                    });
                  }
                  else {
                    return of(false);
                  }
                });
              } else {
                return of(false);
              }
            },error=>{
              console.log(error);
              this.handleError('Ocorreu um erro ao recuperar a lista de detalhes.');
            });
          }        
        }
      }, 'Sim', 'Não'
    );

  }
  handlerSucesso(mensagem: string) {
    this.serviceAlert.mensagemSucesso(mensagem);
  }
  handleError(mensagem: string) {
    this.serviceAlert.mensagemErro('Erro ao carregar a lista de compras. Tente novamente mais tarde.');
  }
  DownloadReport(codigoApuracao: number){
    let row : any[] = []
    let rowD : any[] = []
    let col=['profissional','data','valor-Servico','comissão(%)', 'valor-Comissão', 'Origem-Comissâo']; // initialization for headers
    let title = "Extrato - Apuração" // title of report
    
    let apuracao = this.listaApuracoes.data.find(x=>x.codigo);
    this.profisionalApuracaoDetalheService.get<Array<ProfissionalApuracaoDetalhe>>(codigoApuracao)
                                          .subscribe(agendas=>{
        //linhas da tabela
        for(let a=0; a < agendas.length;a++){
          let valorComissao = (agendas[a].agenda.valorComissaoPercentual/100) * agendas[a].agenda.valorServico;
          let dataApuracao = agendas[a].agenda.data.toLocaleString('BRL');
          dataApuracao = dataApuracao.substring(8,10) + dataApuracao.substring(4,8) + dataApuracao.substring(0,4)  + ' ' +  dataApuracao.substring(11,19) ;
          row.push(agendas[a].profissionalApuracao.profissional.nome)
          row.push(dataApuracao)
          row.push(agendas[a].agenda.valorServico.toFixed(2))      
          row.push(agendas[a].agenda.valorComissaoPercentual.toFixed(2))      
          row.push(valorComissao.toFixed(2))
          row.push(agendas[a].agenda.codigoComissaoOrigem == 1 ? "Profissional": "Serviço")      
          rowD.push(row);
          row =[];
        }
        this.getReport(col , rowD , title, apuracao );
    },error=>{
      console.log(error);
      this.handleError('Ocorreu erro ao gerar o extrato.');
    });
   
  }
  getReport(col: any[], rowD: any[], title: any, profissionalApuracao: ProfissionalApuracao) {
    const totalPagesExp = "{total_pages_count_string}";        
    let pdf = new jsPDF('p', 'pt', 'a4');
    let colResumo = ['','','','','','']
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
  
    rowResumo.push("Codigo");
    rowResumo.push(profissionalApuracao.codigo.toString());
    rowResumo.push("Início");
    rowResumo.push(profissionalApuracao.dataInicio,200,100);
    rowResumo.push("Fim");
    rowResumo.push(profissionalApuracao.dataFim,200,100);
    rowDResumo.push(rowResumo);

    pdf.autoTable(colResumo, rowDResumo,
      {
         
          margin: { top: 110 },
      });
    pdf.autoTable(col, rowD,
        {
            addPageContent: pageContent,
            margin: { top: 310 },
        });

    //for adding total number of pages // i.e 10 etc
    if (typeof pdf.putTotalPages === 'function') {
        pdf.putTotalPages(totalPagesExp);
    }

    pdf.save(title + '.pdf');
}

}
