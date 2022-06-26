import { AlertService } from './../shared/alert/alert.service';
import { ApiResult } from './../shared/base.service';
import { Component, OnDestroy, OnInit,ViewChild } from '@angular/core';
import { Cliente } from './cliente';
//import { HttpClient, HttpParams } from '@angular/common/http';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort} from '@angular/material/sort';
import { ClienteService } from "./cliente.service";
import { EMPTY, Subscription } from 'rxjs';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit, OnDestroy {

  public colunas: string[]=["codigo","nome", "datacadastro","dataalteracao"];
  public clientes: MatTableDataSource<Cliente>;

  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;

  public defaultSortColumn:string = "nome";
  public defaultSortOrder:string = "asc";

  defaultFilterColumn: string= "nome";
  filterQuery:string=null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  inscricao: Subscription;


  constructor(
              private service:ClienteService,
              private serviceAlert: AlertService) { }

  ngOnInit(): void {

    this.loadData();

  }

  ngOnDestroy(){
    this.inscricao.unsubscribe();
  }

  loadData(query:string = null)
  {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex= this.defaultPageIndex;
    pageEvent.pageSize=this.defaultPageSize;
    this.filterQuery = null;

    if (query!== null && query.toString().trim()!==''){
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

    this.inscricao =  this.service.getData<ApiResult<any>>(
                      event.pageIndex,
                      event.pageSize,
                      sortColumn,
                      sortOrder,
                      filterColumn,
                      filterQuery
                    ).subscribe(result=>{
                      this.clientes = new MatTableDataSource<Cliente>(result.data);
                      this.paginator.length=result.totalCount;
                      this.paginator.pageIndex=result.pageIndex;
                      this.paginator.pageSize=result.pageSize;
                      if (this.clientes == null){
                        this.handleError()
                        {
                          return EMPTY;
                        };

                      }
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
    this.serviceAlert.mensagemErro('Erro ao carregar a lista de clientes. Tente novamente mais tarde.');
  }

}
