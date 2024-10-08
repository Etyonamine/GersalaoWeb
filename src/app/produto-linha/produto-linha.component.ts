import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY, Subscription } from 'rxjs';
import { AlertService } from '../shared/alert/alert.service';
import { ApiResult } from '../shared/base.service';
import { ProdutoLinha } from './produto-linha';
import { ProdutoLinhaEditDialogComponent } from './produto-linha-edit-dialog/produto-linha-edit-dialog.component';
import { ProdutoLinhaService } from './produto-linha.service';

@Component({
  selector: 'app-produto-linha',
  templateUrl: './produto-linha.component.html',
  styleUrls: ['./produto-linha.component.scss']
})
export class ProdutoLinhaComponent implements OnInit, OnDestroy {

  colunas : string[] =["codigo","nome", "situacao","acao"];
  linhasProduto: MatTableDataSource<ProdutoLinha>;
  inscricao$: Subscription;
 
  public defaultSortColumn:string = "nome";
  public defaultSortOrder:string = "asc";

  defaultFilterColumn: string= "nome";
  filterQuery:string=null;

  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;

  constructor(
    private produtoLinhaService: ProdutoLinhaService,
    private alertService: AlertService,
    public dialog: MatDialog ,
  ) { }
  ngOnInit(): void {
    this.loadData();
  }
  ngOnDestroy():void
  {
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
  }
  loadData(query:string = null) {
    
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
    this.inscricao$ = this.produtoLinhaService
            .getData<ApiResult<any>>(
              event.pageIndex,
              event.pageSize,
              sortColumn,
              sortOrder,
              filterColumn,
              filterQuery
            ).subscribe(result =>{
                  this.linhasProduto =  new MatTableDataSource<ProdutoLinha>(result.data);
                  this.paginator.length=result.totalCount;
                  this.paginator.pageIndex=result.pageIndex;
                  this.paginator.pageSize=result.pageSize;
             },
              error => {
                console.log(error);
                if(error.status!== 404){
                  this.handleError('Ocorreu um erro na tentativa de listar os tipos de produtos'); 
                }else{
                  return EMPTY;
                }
               
              });
    /* this.inscricao$ = this.produtoLinhaService.list<ProdutoLinha[]>()
    .subscribe(result =>{
                   this.linhasProduto =  new MatTableDataSource<ProdutoLinha>(result);
             },
              error => {
                console.log(error);
                this.handleError('Ocorreu um erro na tentativa de listar os tipos de produtos');
              }); */
  }
  openNovoRegistro()
  {   
    
    // montando os dados de profissional contato
    const ProdutoLinhaAdd = {
      codigo : 0,
      codigoSituacao : 1,
      nome :''
    } as ProdutoLinha;
    // montando o dialogo
    const dialogRef = this.dialog.open(ProdutoLinhaEditDialogComponent,
      {width: '790px' , height: '600px;',
        data : ProdutoLinhaAdd
      });

    //atualizar a pagina quando retornar do dialog
    dialogRef.afterClosed().subscribe(result => {       
      this.loadData();
    });     
  }
  openEditar(codigo: number)
  {
    this.inscricao$ = this.produtoLinhaService.get<ProdutoLinha>(codigo)
                          .subscribe(result => {

                            const ProdutoLinhaEdit = {
                              codigo : result.codigo,
                              codigoSituacao : result.codigoSituacao,
                              nome : result.nome,                              
                              situacao: result.situacao
                            } as ProdutoLinha;
                            
                            const dialog = this.dialog.open(ProdutoLinhaEditDialogComponent,
                              {width: '790px' , height: '600px;',
                                data : ProdutoLinhaEdit
                              });

                            //atualizar a pagina quando retornar do dialog 
                            dialog.afterClosed().subscribe(result => {                              
                              this.loadData();
                            });    
                          }, error =>{
                           
                            this.handleError("Ocorreu um erro na recuperação da informação do tipo de produto.");                            
                          });   

                          
  }         
  openConfirmExclusao(codigo: number,linha: string)
  {
    this.alertService.openConfirmModal('Tem certeza que deseja excluir a Linha [ ' + linha + ' ]?', 'Excluir - tipo de produto', (resposta: boolean) => {
      if (resposta) {
        this.apagar(codigo);
        // this.exclusaoCliente(codigo);
      }
    }, 'Sim', 'Não'
    );
  }
  apagar(codigo:number){
   this.produtoLinhaService.delete(codigo).subscribe(result=>{
    this.handlerSuccess('Registro apagado com sucesso!');
   },error=>{
     this.handleError('Ocorreu um erro ao tentar apagar o registro.');
   });
  }
  handlerSuccess(msg: string) {
    this.alertService.mensagemSucesso(msg);
    this.loadData();
  }

  handleError(msg: string) {
    this.alertService.mensagemErro(msg);
  }

}
