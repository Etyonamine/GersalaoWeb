import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY, of, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Produto } from '../produto/produto';
import { ProdutoService } from '../produto/produto.service';
import { AlertService } from '../shared/alert/alert.service';
import { ApiResult } from '../shared/base.service';
import { Estoque } from './estoque';
import { EstoqueService } from './estoque.service';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {
  //colunas: string[]=["codigo","nome", "quantidade","acao"];
  colunas: string[]=["codigo","nome", "quantidade"];
  estoques: MatTableDataSource<Estoque>;

  //incricao%
  inscricao$: Subscription;
  inscricaoProduto$: Subscription;

  //filtros da consulta
  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;

  public defaultSortColumn:string = "codigoProduto";
  public defaultSortOrder:string = "asc";

  defaultFilterColumn: string= "codigoProduto";
  filterQuery:string=null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  constructor(private estoqueService: EstoqueService,
              private produtoService: ProdutoService,
              private serviceAlert: AlertService) { }

  ngOnInit(): void {
    this.loadData();
  }
  ngOnDestroy(): void {
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if (this.inscricaoProduto$){
      this.inscricaoProduto$.unsubscribe();
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

    this.inscricao$ =  this.estoqueService.estoqueTotal<ApiResult<Estoque>>(
                      event.pageIndex,
                      event.pageSize,
                      sortColumn,
                      sortOrder,
                      filterColumn,
                      filterQuery
                    ).pipe(
                      concatMap(resultado=>{
                      
                        resultado.data.forEach(reg=>{
                                              this.inscricaoProduto$ = this.produtoService.get<Produto>(reg.codigoProduto)
                                                                    .subscribe(produto=>{reg.produto = produto}, error=>
                                                                      {
                                                                        console.error(error);
                                                                        this.handleError()
                                                                        {
                                                                          return EMPTY;
                                                                        };
                                                                      });
                        });

                      return of (resultado);
                      
                      }))
                    .subscribe(result=>{
                      result.data.forEach(reg=>{
                        if(reg.produto === null){
                          reg.produto ={codigo : 0 , nome : ''} as Produto
                        }
                      }

                      );
                      this.estoques = new MatTableDataSource<Estoque>(result.data);                      
                      this.paginator.length=result.totalCount;
                      this.paginator.pageIndex=result.pageIndex;
                      this.paginator.pageSize=result.pageSize;                      
                    }, error=>
                    {
                      console.error(error);
                      if(error.status !== 404){
                        this.handleError();
                      }
                      else                      
                      {
                        return EMPTY;
                      };
                    });
  }
  handleError()
  {
    this.serviceAlert.mensagemErro('Erro ao carregar a lista de estoques. Tente novamente mais tarde.');
  }

}
