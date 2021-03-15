
import { Component, OnInit,ViewChild } from '@angular/core';
import { Cliente } from './cliente';
//import { HttpClient, HttpParams } from '@angular/common/http';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort} from '@angular/material/sort';

import { ApiResult } from './../base.service';
import { ClienteService } from "./cliente.service";

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent  {  
  
  constructor(private clienteService:ClienteService) {
   
   }

  public colunas: string[]=['codigo','nome','aniversario', 'dataCadastro','dataalteracao' ];

  public clientes: MatTableDataSource<Cliente>;

  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;

  public defaultSortColumn:string = "nome";
  public defaultSortOrder:string = "asc";
  
  defaultFilterColumn: string= "nome";
  filterQuery:string=null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;
 urlx :string;

  
  ngOnInit() 
  {     
    this.loadData(null);
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
    
    this.clienteService.getData<ApiResult<Cliente>>(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery
    ).subscribe(result=>{
      this.paginator.length=result.totalCount;
      this.paginator.pageIndex=result.pageIndex;
      this.paginator.pageSize=result.pageSize;
      this.clientes = new MatTableDataSource<Cliente>(result.data);
    }, error=>console.error(error));
  }
 
}
