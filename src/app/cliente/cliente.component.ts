import { Component, OnInit,ViewChild } from '@angular/core';
import { Cliente } from './cliente';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {  
  public colunas: string[]=['codigo','nome','aniversario', 'dataCadastro' ];

  public clientes: MatTableDataSource<Cliente>;

  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;

  public defaultSortColumn:string = "nome";
  public defaultSortOrder:string = "asc";
  
  defaultFilterColumn: string= "nome";
  filterQuery:string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  constructor(private http:HttpClient) { }
  
  ngOnInit():void
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
    var url ='https://localhost:44314/api/clientes'
   
    var params = new HttpParams()
                .set("pageIndex",event.pageIndex.toString())
                .set("pageSize",event.pageSize.toString())
                .set ("sortColumn", (this.sort)?this.sort.active:this.defaultSortColumn)
                .set ("sortOrder", (this.sort)?this.sort.direction:this.defaultSortOrder);
                
    if (this.filterQuery){
      params=params
            .set("filterColumn",this.defaultFilterColumn)
            .set("filterQuery",this.filterQuery);
    }

      this.http.get<any>(url,{params})
                .subscribe(result=>{
                                     console.log(result);
                                     this.paginator.length = result.totalCount;
                                     this.paginator.pageIndex = result.pageIndex;
                                     this.paginator.pageSize = result.pageSize;
                                     this.clientes = new MatTableDataSource<Cliente>(result.data);                                                                  
                                    },error=>console.error(error)
                          );      
  }
 
}
