import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth-guard/auth.service';
import { AlertService } from '../shared/alert/alert.service';
import { ApiResult } from '../shared/base.service';
import { TipoProduto } from './tipo-produto';
import { TipoProdutoDialogoComponent } from './tipo-produto-dialogo/tipo-produto-dialogo.component';
import { TipoProdutoService } from './tipo-produto.service';

@Component({
  selector: 'app-tipo-produto',
  templateUrl: './tipo-produto.component.html',
  styleUrls: ['./tipo-produto.component.scss']
})
export class TipoProdutoComponent implements OnInit, OnDestroy {
  colunas : string[] =["codigo","nome", "situacao","acao"];
  tipoProdutos: MatTableDataSource<TipoProduto>;
  inscricao$: Subscription;
  codigoUsuario: number;

  public defaultSortColumn:string = "nome";
  public defaultSortOrder:string = "asc";

  defaultFilterColumn: string= "nome";
  filterQuery:string=null;

  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;
  
  constructor(
    private tipoProdutoService: TipoProdutoService,
    public dialog: MatDialog ,
    private alertService: AlertService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.authService.getUserData();
    this.codigoUsuario= this.authService.usuarioLogado.codigo;
  }
  ngOnDestroy():void{
    if(this.inscricao$){
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
    this.inscricao$ = this.tipoProdutoService
            .getData<ApiResult<any>>(
              event.pageIndex,
              event.pageSize,
              sortColumn,
              sortOrder,
              filterColumn,
              filterQuery
            ).subscribe(result =>{
                  this.tipoProdutos =  new MatTableDataSource<TipoProduto>(result.data);
                  this.paginator.length=result.totalCount;
                  this.paginator.pageIndex=result.pageIndex;
                  this.paginator.pageSize=result.pageSize;
             },
              error => {
                console.log(error);
                this.handleError('Ocorreu um erro na tentativa de listar os tipos de produtos');
              });
    /* this.inscricao$ = this.tipoProdutoService.list<TipoProduto[]>()
    .subscribe(result =>{
                   this.tipoProdutos =  new MatTableDataSource<TipoProduto>(result);
             },
              error => {
                console.log(error);
                this.handleError('Ocorreu um erro na tentativa de listar os tipos de produtos');
              }); */
  }
  openNovoRegistro()
  {   
    
    // montando os dados de profissional contato
    const tipoProdutoAdd = {
      codigo : 0,
      codigoSituacao : 1,
      nome :''
    } as TipoProduto;
    // montando o dialogo
    const dialogRef = this.dialog.open(TipoProdutoDialogoComponent,
      {width: '790px' , height: '600px;',
        data : tipoProdutoAdd
      });

    //atualizar a pagina quando retornar do dialog
    dialogRef.afterClosed().subscribe(result => {       
      this.loadData();
    });     
  }
  openEditar(codigo: number)
  {
    this.inscricao$ = this.tipoProdutoService.get<TipoProduto>(codigo)
                          .subscribe(result => {

                            const tipoProdutoEdit = {
                              codigo : result.codigo,
                              codigoSituacao : result.codigoSituacao,
                              nome : result.nome,                              
                              situacao: result.situacao
                            } as TipoProduto;
                            
                            const dialog = this.dialog.open(TipoProdutoDialogoComponent,
                              {width: '790px' , height: '600px;',
                                data : tipoProdutoEdit
                              });

                            //atualizar a pagina quando retornar do dialog 
                            dialog.afterClosed().subscribe(result => {                               
                              this.loadData();
                            });    
                          }, error =>{
                           
                            this.handleError("Ocorreu um erro na recuperação da informação do tipo de produto.");                            
                          });   

                          
  }         
  openConfirmExclusao(codigo: number,tipo: string)
  {
    this.alertService.openConfirmModal('Tem certeza que deseja excluir o tipo [ ' + tipo + ' ]?', 'Excluir - tipo de produto', (resposta: boolean) => {
      if (resposta) {
        this.apagar(codigo);
        // this.exclusaoCliente(codigo);
      }
    }, 'Sim', 'Não'
    );
  }
  apagar(codigo:number){
   this.tipoProdutoService.delete(codigo).subscribe(result=>{
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
