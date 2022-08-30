import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import { AlertService } from '../shared/alert/alert.service';
import { ApiResult } from '../shared/base.service';
import { ProfissionalApuracao } from './profissional-apuracao';
import { ProfissionalApuracaoService } from './profissional-apuracao.service';

@Component({
  selector: 'app-profissional-apuracao',
  templateUrl: './profissional-apuracao.component.html',
  styleUrls: ['./profissional-apuracao.component.scss']
})
export class ProfissionalApuracaoComponent implements OnInit {

  colunas: string[]=["nome","codigo","data", "valor","inicio","fim","total","dataBaixa","acao"];
  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;
  inscricao$:Subscription;
  dataPesquisa:Date;

  public defaultSortColumn:string = "CodigoProfissional";
  public defaultSortOrder:string = "desc";

  defaultFilterColumn: string= "CodigoProfissional";
  filterQuery:string=null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  listaApuracoes:  MatTableDataSource<ProfissionalApuracao> ;

  constructor(private serviceAlert:AlertService,
              private profissionalApuracaoService: ProfissionalApuracaoService) { }

  ngOnInit(): void {
    this.loadData();
  }
  ngOnDestroy(): void{
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
  }
  clearDate(event){
    event.stopPropagation();
    this.dataPesquisa = null;
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
    var filterColumn =(this.filterQuery)?this.defaultFilterColumn:null;
    var filterQuery=(this.filterQuery)?this.filterQuery:null;
  
    this.inscricao$ =  this.profissionalApuracaoService.getData<ApiResult<any>>(
                      event.pageIndex,
                      event.pageSize,
                      sortColumn,
                      sortOrder,
                      filterColumn,
                      filterQuery
                    ).subscribe(result=>{

                      this.listaApuracoes = new MatTableDataSource<ProfissionalApuracao>(result.data);                      
                      this.paginator.length=result.totalCount;
                      this.paginator.pageIndex=result.pageIndex;
                      this.paginator.pageSize=result.pageSize;                      
                    }, error=>
                    {
                      console.error(error);
                      if (error.status!== 404){
                        this.handleError();
                      }else{
                        return EMPTY;
                      }                      
                    });
  }

  handleError()
  {
    this.serviceAlert.mensagemErro('Erro ao carregar a lista de compras. Tente novamente mais tarde.');
  }
 


}
