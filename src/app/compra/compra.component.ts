import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY, Subscription } from 'rxjs';
import { AlertService } from '../shared/alert/alert.service';
import { ApiResult } from '../shared/base.service';
import { Compra } from './compra';
import { CompraServiceService } from './compra-service.service';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.scss']
})
export class CompraComponent implements OnInit, OnDestroy {
  compras: MatTableDataSource<Compra>;
  inscricao$  : Subscription;
  colunas: string[]=["codigo","data", "valor","datacadastro","acao"];
 
  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;

  public defaultSortColumn:string = "codigo";
  public defaultSortOrder:string = "asc";

  defaultFilterColumn: string= "codigo";
  filterQuery:string=null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  constructor(
              private compraService: CompraServiceService,
              private serviceAlert: AlertService) { }

  ngOnInit(): void {
    this.loadData();
  }


  ngOnDestroy(){
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
  }
  
  loadData(query:string = null)
  {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex= this.defaultPageIndex;
    pageEvent.pageSize=this.defaultPageSize;

    if (query){
      this.filterQuery=query;
    }

    this.getData(pageEvent);

  }

  getData(event:PageEvent)
  {
    var sortColumn = (this.sort)?this.sort.active:this.defaultSortColumn;
    var sortOrder = (this.sort)?this.sort.direction:this.defaultSortOrder;
    var filterColumn =(this.filterQuery)?this.defaultFilterColumn:null;
    var filterQuery=(this.filterQuery)?this.filterQuery:null;

    this.inscricao$ =  this.compraService.getData<ApiResult<any>>(
                      event.pageIndex,
                      event.pageSize,
                      sortColumn,
                      sortOrder,
                      filterColumn,
                      filterQuery
                    ).subscribe(result=>{

                      this.compras = new MatTableDataSource<Compra>(result.data);                      
                      this.paginator.length=result.totalCount;
                      this.paginator.pageIndex=result.pageIndex;
                      this.paginator.pageSize=result.pageSize;                      
                    }, error=>
                    {
                      console.error(error);
                      this.handleError()
                      {
                        return EMPTY;
                      };
                    });
  }

  handleError()
  {
    this.serviceAlert.mensagemErro('Erro ao carregar a lista de compras. Tente novamente mais tarde.');
  }

}
