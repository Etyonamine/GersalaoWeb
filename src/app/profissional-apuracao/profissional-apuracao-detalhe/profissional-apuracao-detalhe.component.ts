import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ApiResult } from 'src/app/shared/base.service';
import { ProfissionalApuracao } from '../profissional-apuracao';
import { ProfissionalApuracaoDetalhe } from './profissional-apuracao-detalhe';
import { ProfissionalApuracaoDetalheService } from './profissional-apuracao-detalhe.service';

@Component({
  selector: 'app-profissional-apuracao-detalhe',
  templateUrl: './profissional-apuracao-detalhe.component.html',
  styleUrls: ['./profissional-apuracao-detalhe.component.scss']
})
export class ProfissionalApuracaoDetalheComponent implements OnInit {

  
   colunas: string[]=["codigo","data","cliente","servico", "valorServico","valorComissaoPercentual","valorComissao", "origemComissao"]; 
  codigoProfissionalApuracao: number;  
  valorTotal : number;
  dataApuracao: Date;
  quantidadeTotal: number;
  nomeUsuarioCadastro: string;
  inicioPeriodo: Date;
  fimPeriodo: Date;
  situacaoBaixa : string;

  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;
  inscricao$:Subscription;  

  public defaultSortColumn:string = "dataAgenda";
  public defaultSortOrder:string = "asc";

  defaultFilterColumn: string= "codigoProfissionalApuracao";
  filterQuery:string=null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  listaApuracoes:  MatTableDataSource<ProfissionalApuracaoDetalhe> ;
  
  constructor(private profissionalApuracaoDetalheService : ProfissionalApuracaoDetalheService,
              private serviceAlert: AlertService,
              private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.codigoProfissionalApuracao =  this.route.snapshot.data.codigoApuracao;
    this.loadData();
  }

  loadData(query:string = null)
  {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex= this.defaultPageIndex;
    pageEvent.pageSize=this.defaultPageSize;
    this.filterQuery = null;

    if (query!== null && query.toString().trim()!==''){      
      
      let dataPesq = new Date(query).toLocaleDateString();
      
      let novaData = dataPesq.substring(6,10) + '-' +  dataPesq.substring(3,5) + '-' + dataPesq.substring(0,2);
      this.filterQuery =   novaData;
    }

    this.getData(pageEvent);

  }
  getData(event:PageEvent)
  {
    var sortColumn = (this.sort)?this.sort.active:this.defaultSortColumn;
    var sortOrder = (this.sort)?this.sort.direction:this.defaultSortOrder;
    /* var filterColumn =(this.filterQuery)?this.defaultFilterColumn:null;
    var filterQuery=(this.filterQuery)?this.filterQuery:null; */
    var filterColumn ='codigoProfissionalApuracao';
    var filterQuery= this.codigoProfissionalApuracao.toString();
  
    this.inscricao$ =  this.profissionalApuracaoDetalheService.getData2<ApiResult<any>>(
                      event.pageIndex,
                      event.pageSize,
                      sortColumn,
                      sortOrder,
                      filterColumn,
                      filterQuery,
                      'N'
                    ).subscribe(result=>{

                      this.listaApuracoes = new MatTableDataSource<ProfissionalApuracaoDetalhe>(result.data); 
                      this.preencherDadosApuracao(result.data);
                      this.paginator.length=result.totalCount;
                      this.paginator.pageIndex=result.pageIndex;
                      this.paginator.pageSize=result.pageSize;                      
                    }, error=>
                    {
                      console.error(error);
                      if (error.status!== 404){
                        this.handleError('Erro ao carregar a lista de compras. Tente novamente mais tarde.');
                      }else{
                        return EMPTY;
                      }                      
                    });
  }
  preencherDadosApuracao(profissionalApuracao){
    this.dataApuracao = profissionalApuracao[0].profissionalApuracao.dataApuracao;
    this.valorTotal = profissionalApuracao[0].profissionalApuracao.valorTotal;
    this.quantidadeTotal = profissionalApuracao[0].profissionalApuracao.quantidadeTotal;
    this.nomeUsuarioCadastro = profissionalApuracao[0].profissionalApuracao.usuarioCadastro.nome;
    this.inicioPeriodo = profissionalApuracao[0].profissionalApuracao.dataInicio;
    this.fimPeriodo = profissionalApuracao[0].profissionalApuracao.dataFim;
    this.situacaoBaixa = profissionalApuracao[0].profissionalApuracao.dataBaixa == null? "Pendente": "Baixado";
  }
  handleError(mensagem:string)
  {
    this.serviceAlert.mensagemErro(mensagem);
  }
}
