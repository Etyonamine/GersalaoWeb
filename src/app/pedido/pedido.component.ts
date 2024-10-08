import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AlertService } from '../shared/alert/alert.service';
import { ApiResult } from '../shared/base.service';
import { Pedido } from './pedido';
import { PedidoService } from './pedido.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss']
})
export class PedidoComponent implements OnInit {
  colunas: string[]=["cliente","codigo","dataPedido", "valorTotal","dataFechto", "dataCancelamento","situacao","acao"];
  pedidos: MatTableDataSource<Pedido>;
  inscricao$: Subscription;
  codigoPedido: number;
  codigoCliente: number;
  numeroPedidoFmt: string;
  
  //filtros da consulta
  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;

  public defaultSortColumn:string = "numeroPedido";
  public defaultSortOrder:string = "desc";

  defaultFilterColumn: string= "NomeCliente";
  filterQuery:string=null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  constructor(private serviceAlert: AlertService,
              private pedidoService: PedidoService) { }

  ngOnInit(): void {
    this.pedidos = null;
    this.loadData();
    this.codigoCliente = 0;
    this.codigoPedido =0 ;
  }

  ngOnDestroy(): void {
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }    
  }

  loadData(query:string = null)
  {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex= this.defaultPageIndex;
    pageEvent.pageSize=this.defaultPageSize;
    
    if (query!== null && query.toString().trim()!== ''){
      this.filterQuery=query;
    }else{
      this.filterQuery = null;
    }

    this.getData(pageEvent);

  }
  getData(event:PageEvent)
  {
    var sortColumn = (this.sort)?this.sort.active:this.defaultSortColumn;
    var sortOrder = (this.sort)?this.sort.direction:this.defaultSortOrder;
    var filterColumn =(this.filterQuery)?this.defaultFilterColumn:null;
    var filterQuery=(this.filterQuery)?this.filterQuery:null;

    this.inscricao$ =  this.pedidoService.getData<ApiResult<Pedido>>(
                      event.pageIndex,
                      event.pageSize,
                      sortColumn,
                      sortOrder,
                      filterColumn,
                      filterQuery
                    ).subscribe(result =>{

                    
                      this.pedidos = new MatTableDataSource<Pedido>(result.data);                      
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
    this.serviceAlert.mensagemErro('Erro ao carregar a lista de pedidos. Tente novamente mais tarde.');
  }

}
