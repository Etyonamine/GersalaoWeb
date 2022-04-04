import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import { AlertService } from '../shared/alert/alert.service';
import { ApiResult } from '../shared/base.service';
import { Compra } from './compra';
import { CompraBaixaPagtoComponent } from './compra-baixa-pagto/compra-baixa-pagto.component';
import { CompraServiceService } from './compra-service.service';

export interface DialogDataBaixaPagto {  
  codigoCompra: number; 
  dataCompra : Date;
  dataBoleto : Date;
  valorTotal : number; 
}

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.scss']
})
export class CompraComponent implements OnInit, OnDestroy {
  compras: MatTableDataSource<Compra>;
  inscricao$  : Subscription;
  colunas: string[]=["codigo","dataCompra", "valor","dataVenctoBoleto","dataPagtoBoleto","datacadastro","acao"];
 
  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;

  public defaultSortColumn:string = "codigo";
  public defaultSortOrder:string = "desc";

  defaultFilterColumn: string= "codigo";
  filterQuery:string=null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

   
  constructor(
              private compraService: CompraServiceService,
              private serviceAlert: AlertService,
              public dialog: MatDialog              ) { }

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

  dialogBaixaPagto(codigoCompraParam:number){
    let index = this.compras.data.findIndex(x=>x.codigo === codigoCompraParam);
    const objCompra = this.compras.data[index];

     // montando o dialogo
     const dialogRef = this.dialog.open(CompraBaixaPagtoComponent,
      {width: '700px' , height: '900px;',
        data : {
                 codigoCompra: codigoCompraParam,
                 dataCompra: objCompra.dataCompra,
                 dataBoleto: objCompra.dataVenctoBoleto,
                 valorTotal: objCompra.valor
                }
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.loadData();
    });
  }

}
