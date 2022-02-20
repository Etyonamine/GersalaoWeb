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
import { Estoque } from 'src/app/estoque/estoque';
import { EstoqueService } from 'src/app/estoque/estoque.service';
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
  percentualComissao: number;
  codigoProdutoSelecionado : number;
  itensPedidos2: Array<PedidoItem> = [];
  valorCusto : number;
  estoque : Estoque;

  pedido: Pedido;
  clientes: Array<Cliente>;
  produtos: Array<Produto>;
  itensPedido: MatTableDataSource<PedidoItem>;
  tituloPagina:string;
  formulario: FormGroup;
  inscricao$: Subscription;
  inscricaoItem$: Subscription;
  inscricaoProduto$:Subscription;
  inscricaoEstoque$:Subscription;
  
  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private clienteService: ClienteService,
              private pedidoItemService: PedidoItemService,
              private produtoService: ProdutoService,
              private serviceAlert: AlertService,
              private serviceEstoque: EstoqueService,
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
    this.valorProdutoSel = 0;
    this.quantidadeProdutoSel = 1;
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
      observacao: [this.pedido.observacao==null?null: this.pedido.observacao] ,
      codigoProdutoSelecionado: [{value: null, disabled: this.pedido.dataFechamento != null?true:false}]
        
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

                      this.itensPedidos2 = result.data;
                     /*  this.itensPedido = new MatTableDataSource<PedidoItem>(result.data);                      
                      this.paginator.length=result.totalCount;
                      this.paginator.pageIndex=result.pageIndex;
                      this.paginator.pageSize=result.pageSize;        */               
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

  
    
    if (this.codigoProdutoSelecionado == 0 || this.codigoProdutoSelecionado == undefined){
      this.handleError('Por favor, selecionar um produto válido!');
      return false;
    } 
    if (Number(this.valorProdutoSel) == NaN ||this.valorProdutoSel == undefined){
      this.handleError('Por favor, informar um valor de venda válido!');
      return false;
    }
    if (this.quantidadeProdutoSel == 0 || this.quantidadeProdutoSel == undefined ){
      this.handleError('Por favor, informar a quantidade de itens do produto!');
      return false;
    }

    if (this.itensPedidos2.find(x=>x.codigoProduto == this.codigoProdutoSelecionado)){
      this.handlerExclamation("Este produto já está na lista!Por favor, remover primeiro e tentar novamente.");
      return false;
    }
    //this.produtos.find(x=>x.codigo==this.codigoProdutoSelecionado);
    /* let pedidoItemAdd = {
                          codigoProduto : this.codigoProdutoSelecionado,
                          quantidade : this.quantidadeProdutoSel,
                          valorVenda : this.valorProdutoSel, 
                          produto: this.produtos.find(x=>x.codigo==this.codigoProdutoSelecionado)
                        } as PedidoItem; */
    this.itensPedidos2.push({
                            codigo : 1,
                            valorCusto : this.valorCusto,
                            pedido : null,
                            cliente : null, 
                            codigoPedido : this.codigoPedido,
                            codigoCliente : this.codigoCliente,
                            codigoProduto : this.codigoProdutoSelecionado,
                            quantidade : this.quantidadeProdutoSel,
                            valorVenda : this.valorProdutoSel, 
                            dataAlteracao : null,
                            dataCadastro : new Date(),
                            produto: this.produtos.find(x=>x.codigo == this.codigoProdutoSelecionado)} );
  //somando o valor total
  this.valorTotal = this.valorTotal + (this.valorProdutoSel * this.quantidadeProdutoSel);
  this.quantidadeTotal = this.quantidadeTotal + this.quantidadeProdutoSel ;

   //limpando as selecões   
   this.codigoProdutoSelecionado = 0 ;
   this.valorProdutoSel  = 0;
   this.quantidadeProdutoSel = 1;
   this.formulario.controls['codigoProdutoSelecionado'].setValue('0');
   

  }
  removeListaItem(codigoProduto:number){
    //subtraindo o valor total
    this.valorTotal = this.valorTotal - (this.itensPedidos2.find(x=>x.codigoProduto).valorVenda * this.itensPedidos2.find(x=>x.codigoProduto).quantidade);
    this.quantidadeTotal = this.quantidadeTotal - this.itensPedidos2.find(x=>x.codigoProduto).quantidade ;

    //removendo o array
    let indexExcluir = this.itensPedidos2.findIndex(x=>x.codigoProduto);
    this.itensPedidos2.splice(indexExcluir,1);

    
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
  preencherValorProdutoSelecionado(codigoProduto){
    this.codigoProdutoSelecionado = codigoProduto;
    this.valorCusto =0;
    this.valorProdutoSel = 0;

    let indexProduto = this.produtos.findIndex(x=>x.codigo == codigoProduto);
    this.percentualComissao = ((this.produtos[indexProduto].valorComissao / 100) + 1);

    /* this.inscricaoEstoque$ = this.serviceEstoque.valorVenda(codigoProduto)
                                                .subscribe(result=>{
                                                    let valorEncontrado = result;

                                                    if (valorEncontrado >=0 ){
                                                        this.valorProdutoSel = (Number(valorEncontrado) * this.percentualComissao);
                                                        this.valorProdutoSel = Number(this.valorProdutoSel.toFixed(2));
                                                        
                                                    }else{
                                                      this.valorProdutoSel = 0;
                                                    }
                                                    
                                                }, error =>{
                                                  console.log('erro ao consultar o valor unitario');
                                                  this.handleError('Ocorreu erro de calculo de valor de venda.');
                                                }); */

    this.inscricaoEstoque$ = this.serviceEstoque.estoquePorProduto(codigoProduto)
                                                .subscribe(result=>{
                                                  if (result.length > 0 ) {
                                                    
                                                    this.estoque = result[0];
                                                    
                                                    this.valorProdutoSel = (this.estoque.valorUnitario * this.percentualComissao);
                                                    this.valorCusto = this.estoque.valorUnitario;

                                                    this.valorProdutoSel = Number(this.valorProdutoSel.toFixed(2));
                                                    this.valorCusto = Number(this.valorCusto.toFixed(2));
 
                                                  }else{
                                                    this.handlerExclamation('Não existe estoque para este produto!');
                                                  }
                                                  
                                                }, 
                                                error=>{
                                                  console.log(error);
                                                  this.handleError('Ocorreu um erro ao tentar recuperar as informações do produto no estoque!')
                                                });

    
  }
  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }
  handlerExclamation(msg:string){
    this.serviceAlert.mensagemExclamation(msg);
  }
}
