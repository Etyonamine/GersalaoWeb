import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AlertService } from '../shared/alert/alert.service';
import { ApiResult } from '../shared/base.service';
import { Produto } from './produto';
import { ProdutoEditComponent } from './produto-edit/produto-edit.component';
import { ProdutoService } from './produto.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

  produtos: MatTableDataSource<Produto>;
  colunas: string[] =["codigo","tipo","nome", "acao"];

  
  public defaultSortColumn:string = "nome";
  public defaultSortOrder:string = "asc";

  defaultFilterColumn: string= "nome";
  filterQuery:string=null;

  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;
  
  inscricao$: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  constructor(
              private alertService: AlertService, 
              private produtoService: ProdutoService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  
  loadData(query:string = null){
    var pageEvent = new PageEvent();
    pageEvent.pageIndex= this.defaultPageIndex;
    pageEvent.pageSize=this.defaultPageSize;

    if (query){
      this.filterQuery=query;
    }
    this.getData(pageEvent);
    
  } 
  
  getData(event:PageEvent){
    var sortColumn = (this.sort)?this.sort.active:this.defaultSortColumn;
    var sortOrder = (this.sort)?this.sort.direction:this.defaultSortOrder;
    var filterColumn =(this.filterQuery)?this.defaultFilterColumn:null;
    var filterQuery=(this.filterQuery)?this.filterQuery:null;

    this.inscricao$ = this.produtoService
            .getData<ApiResult<any>>(
              event.pageIndex,
              event.pageSize,
              sortColumn,
              sortOrder,
              filterColumn,
              filterQuery
            ).subscribe(result =>{
                  this.produtos =  new MatTableDataSource<Produto>(result.data);
                  this.paginator.length=result.totalCount;
                  this.paginator.pageIndex=result.pageIndex;
                  this.paginator.pageSize=result.pageSize;
             },
              error => {
                console.log(error);
                this.handleError('Ocorreu um erro na tentativa de listar os produtos');
              });
  }

  openNovoRegistro()
  {
    // montando os dados de profissional contato
    const ProdutoAdd = {
      codigo : 0,
      nome : null,
      codigoFornecedor : null,
      observacao : null,
      codigoSituacao : 1,
      situacao : null, 
      tipoProduto : null
    } as Produto;

    // montando o dialogo
    const dialogRef = this.dialog.open(ProdutoEditComponent,
      {width: '790px' , height: '600px;',
        data : ProdutoAdd
      });

    //atualizar a pagina quando retornar do dialog
    dialogRef.afterClosed().subscribe(result => {       
        //this.loadData();
    }); 
  }
  
  handlerSuccess(msg: string) {
    this.alertService.mensagemSucesso(msg);
  }

  handleError(msg: string) {
    this.alertService.mensagemErro(msg);
  }

}
