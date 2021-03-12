import { Component, OnInit,ViewChild } from '@angular/core';
import { Cliente } from './cliente';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  public clientes:MatTableDataSource<Cliente>;
  
  public colunas: string[]=['codigo','nome' ];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  

  constructor(private http:HttpClient) { }
  
  ngOnInit()
  {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex=0;
    pageEvent.pageSize=3;
    this.getData(pageEvent);   
  } 
  
  getData(event:PageEvent)
  {
    var url ='https://localhost:44314/api/clientes'
       
        var params = new HttpParams()  
                          .set("pageIndex", event.pageIndex.toString())
                          .set("pageSize", event.pageSize.toString());

    this.http.get<any>(url,{params})
              .subscribe(result=>{  
                                   this.paginator.length = result.totalCount;
                                   this.paginator.pageIndex = result.pageIndex;
                                   this.paginator.pageSize = result.pageSize;
                                   this.clientes = new MatTableDataSource<Cliente>(result.data);                             
                                  },error=>console.error(error)
                        );
  }
 
}
