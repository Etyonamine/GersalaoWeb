import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import { Cliente } from 'src/app/cliente/cliente';
import { ClienteService } from 'src/app/cliente/cliente.service';
import { Produto } from 'src/app/produto/produto';
import { ProdutoService } from 'src/app/produto/produto.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ApiResult } from 'src/app/shared/base.service';
import { Pedido } from '../pedido';
import { PedidoItem } from '../pedido-item/pedido-item';
import { PedidoItemComponent } from '../pedido-item/pedido-item.component';
import { PedidoItemService } from '../pedido-item/pedido-item.service';

@Component({
  selector: 'app-pedido-form',
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.scss']
})
export class PedidoFormComponent extends BaseFormComponent implements OnInit, OnDestroy {
  submit() {
    
  }


  colunas: string[]=["codigo","produto","valor", "quantidade","subTotal","acao"];
  defaultPageIndex :number = 0 ;
  defaultPageSize:number = 10;

  public defaultSortColumn:string = "codigo";
  public defaultSortOrder:string = "desc";

  defaultFilterColumn: string= "codigo";
  filterQuery:string=null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;
  
  codigoCliente: number;
  codigoPedido: number;
  dataPedido: string;
  valorTotal: number;
  quantidadeTotal:number;
  dataFechto: string;
  situacao: string;
  quantidadeProdutoSel: number;
  valorProdutoSel: number;

  pedido: Pedido;
  clientes: Array<Cliente>;
  produtos: Array<Produto>;
  itensPedido: MatTableDataSource<PedidoItem>;
  tituloPagina:string;
  formulario: FormGroup;
  inscricao$: Subscription;
  inscricaoItem$: Subscription;
  inscricaoProduto$:Subscription;
  
  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private clienteService: ClienteService,
              private pedidoItemService: PedidoItemService,
              private produtoService: ProdutoService,
              private serviceAlert: AlertService,
              public dialog: MatDialog  
              )
     {
    super();
  }

  ngOnInit(): void {
    this.pedido = this.route.snapshot.data['pedido'];
    this.codigoCliente = this.pedido != null?this.pedido.codigoCliente:0;
    this.codigoPedido = this.pedido != null?this.pedido.codigo:0;
    this.tituloPagina = this.pedido != null?"Editar":"Novo";
    this.dataPedido = this.pedido != null?this.pedido.dataPedido.toString():new Date().toString();
    this.valorTotal = this.pedido != null?this.pedido.valorTotal:0;
    this.quantidadeTotal = this.pedido != null?this.pedido.quantidadeTotal:0;
    this.dataFechto = this.pedido.dataFechamento != null?this.pedido.dataFechamento.toString():"";
    this.situacao = this.pedido.dataFechamento != null?"Fechado":"Aberto";

    this.criarFormulario();
    this.listarClientes();
    this.loadData();
    this.listaProdutos()
  }
  ngOnDestroy(){
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if (this.inscricaoItem$){
      this.inscricaoItem$.unsubscribe();
    }
    if(this.inscricaoProduto$){
      this.inscricaoProduto$.unsubscribe();
    }
  }
  criarFormulario(){
    this.formulario = this.formBuilder.group({
      codigoPedido: [this.codigoPedido],
      codigoCliente: [this.codigoCliente],            
      situacao: [ this.situacao ],
      observacao: [this.pedido.observacao==null?null: this.pedido.observacao]
    });
  }
  listarClientes(){
    this.inscricao$ = this.clienteService.lista()
                                         .subscribe(result=>{

                                            this.clientes = result;
                                         }, 
                                         error=>{
                                           console.log(error);
                                           this.handleError("Ocorreu um erro na tentativa de recuperar a lista de clientes.");
                                         });
                                         
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

    this.inscricaoItem$ =  this.pedidoItemService.getDataCodigo<ApiResult<PedidoItem>>(
                      this.codigoCliente,
                      this.codigoPedido,
                      event.pageIndex,
                      event.pageSize,
                      sortColumn,
                      sortOrder,
                      filterColumn,
                      filterQuery
                    ).subscribe(result =>{

                    
                      this.itensPedido = new MatTableDataSource<PedidoItem>(result.data);                      
                      this.paginator.length=result.totalCount;
                      this.paginator.pageIndex=result.pageIndex;
                      this.paginator.pageSize=result.pageSize;                      
                    }, error=>
                    {
                      console.error(error);
                      this.handleError("Erro ao listar itens do pedido.");
                    });
  }
  getQuantidadeTotal(){
    let total:number = 0;
    
    if (!this.itensPedido){
      return total;
    }

    this.itensPedido.data.forEach(item=>{
      total+=(item.quantidade );
    });
    
    return total;
  }
  openDialogPedidoItem(){
    const dialogRef = this.dialog.open(PedidoItemComponent,
      {width: '790px' , height: '600px;',
        data : {
                  
                 codigoCliente : this.codigoCliente,
                 codigoPedido : this.codigoPedido                 
                }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.loadData();
    });
  }
  getValorTotal() {
    let total:number = 0;
    

    if (!this.itensPedido){
      return total;
    }

    this.itensPedido.data.forEach(item=>{
      total+=(item.valorVenda * item.quantidade);
    });

    this.valorTotal = total;
    return total;
  }
  handleError(message:string)
  {
    this.serviceAlert.mensagemErro(message);
  }
  adicionarListaItem(){

  }
  listaProdutos(){
    this.inscricaoProduto$ = this.produtoService.ListarTodos()
                                                .subscribe(result=>{
                                                  this.produtos = result;
                                                },error=>{
                                                  console.log(error);
                                                  this.handleError('Erro ao recuperar lista de produtos.');
                                                })
  }
  preencherValorProdutoSelecionado(codigo){
    //this.valorProdutoSel = this.produtos.find(x=>x.codigo == codigo);
    this.handlerSuccess(codigo);
  }
  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }
}
