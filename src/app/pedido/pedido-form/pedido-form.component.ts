import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { timeStamp } from 'console';
import { now } from 'moment';
import { EMPTY, of, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
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
import { PedidoBaixaPagtoComponent } from '../pedido-baixa-pagto/pedido-baixa-pagto.component';
import { PedidoItem } from '../pedido-item/pedido-item';
import { PedidoItemComponent } from '../pedido-item/pedido-item.component';
import { PedidoItemService } from '../pedido-item/pedido-item.service';
import { PedidoService } from '../pedido.service';

@Component({
  selector: 'app-pedido-form',
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.scss']
})
export class PedidoFormComponent extends BaseFormComponent implements OnInit, OnDestroy {
 


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
  dataFechto: Date;
  dataCancelamento: string;
  motivoCancelamento:string;


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
  inscricaoErroGravar$:Subscription;
  inscricaoDelete$: Subscription;
  inscricaoAdicionarEstoque$: Subscription;
  inscricaoValorCusto$: Subscription;

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private clienteService: ClienteService,
              private pedidoService: PedidoService,
              private pedidoItemService: PedidoItemService,
              private serviceAlert: AlertService,
              private serviceEstoque: EstoqueService,
              public dialog: MatDialog  ,
              private router: Router,
              )
     {
    super();
  }

  ngOnInit(): void {
    this.pedido = this.route.snapshot.data['pedido'];
    this.codigoCliente = this.pedido != null?this.pedido.codigoCliente:null;
    this.codigoPedido = this.pedido != null?this.pedido.codigo:0;
    this.tituloPagina = this.pedido != null?"Editar":"Novo";
    this.dataPedido = this.pedido != null?this.pedido.dataPedido.toString():new Date().toString();
    this.valorTotal = this.pedido != null?this.pedido.valorTotal:0;
    this.quantidadeTotal = this.pedido != null?this.pedido.quantidadeTotal:0;
    
    this.motivoCancelamento = this.pedido!= null ? this.pedido.motivoCancelamento: null;

    if (this.pedido != undefined){
      this.dataFechto = this.pedido.dataFechamento != null?this.pedido.dataFechamento:null;  
      if (this.pedido.dataCancelamento != null){
        this.situacao ="Cancelado";
      }else{
        this.situacao = this.pedido.dataFechamento != null?"Fechado":"Aberto";
      }
      
    }else{
      this.dataFechto = null;
      this.situacao = "Aberto";
    }
    
    this.criarFormulario();
    this.listarClientes();
    this.loadData();
    this.listaProdutoEstoque()
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
    if (this.inscricaoErroGravar$){
      this.inscricaoErroGravar$.unsubscribe();
    }
    if (this.inscricaoDelete$){
      this.inscricaoDelete$.unsubscribe();
    }
    if (this.inscricaoAdicionarEstoque$)
    {
      this.inscricaoAdicionarEstoque$.unsubscribe();
    }
  }
  criarFormulario(){
    let observParam : string;

    if (this.pedido!= undefined){
      observParam = this.pedido.observacao ;
    }
    this.formulario = this.formBuilder.group({
      numeroPedido: [ this.pedido!= null ||this.pedido!=undefined ? this.pedido.numeroPedido : "0"],
      codigoCliente: [this.codigoCliente,[Validators.required]] ,            
      situacao: [ this.situacao ],
      observacao: [{value:observParam == null ?null: observParam, disabled: (this.dataFechto != null  )? true:false}] ,
      codigoProdutoSelecionado: [{value: null, disabled: this.pedido!= undefined && this.pedido.dataFechamento != null?true:false}],
      motivoCancelamento: this.motivoCancelamento,
      dataCancelamento: (this.pedido != null && this.pedido.dataCancelamento != null )? this.pedido.dataCancelamento : null
        
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
                      if (result && result.totalCount >0 ){
                        this.itensPedidos2 = result.data;
                        this.itensPedidos2.forEach(item=>{
                          this.quantidadeTotal += item.quantidade;
                        });
                      }
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
                            codigo : 0,
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
                            numeroPedido : '0000',
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
    this.serviceAlert.openConfirmModal('Tem certeza que deseja remover da lista este item de pedido?', 'Remover da lista - Pedido', (answer: boolean) => 
    {
      let qtdeItens = this.itensPedidos2.length;

      if (!answer)
      {        
        return false;
      }
      else{
      //subtraindo o valor total
      this.valorTotal = this.valorTotal - (this.itensPedidos2.find(x=>x.codigoProduto).valorVenda * this.itensPedidos2.find(x=>x.codigoProduto).quantidade);
      this.quantidadeTotal = this.quantidadeTotal - this.itensPedidos2.find(x=>x.codigoProduto).quantidade ;
        
      //removendo o array
      let indexExcluir = this.itensPedidos2.findIndex(x=>x.codigoProduto);
      if(this.itensPedidos2[indexExcluir].codigo > 0 ){
        //excluindo o item da tabela pedido_item
        this.inscricaoDelete$ = this.pedidoItemService.excluirItem(this.itensPedidos2[indexExcluir].codigo,
                                                                   this.itensPedidos2[indexExcluir].codigoPedido, 
                                                                   this.itensPedidos2[indexExcluir].codigoCliente)
                                                       .pipe(
                                                          concatMap(result=>{
                                                            if (result){
                                                                          this.inscricaoAdicionarEstoque$ = this.serviceEstoque.adicionarQuantidadePorProduto(this.itensPedidos2[indexExcluir].codigoPedido, 
                                                                                                                                                  this.itensPedidos2[indexExcluir].quantidade)                                                                                                                    
                                                                                                                   .subscribe(retorno=>{
                                                                                                                      //se for igual a 1 o tamanho da matriz deve atualizar o pedido
                                                                                                                      if(retorno && qtdeItens == 1){
                                                                                                                        this.pedido.valorTotal = 0 ;
                                                                                                                        this.pedido.quantidadeTotal =0 ;                                                                                                                       
                                                                                                                        
                                                                                                                        this.inscricao$ = this.pedidoService.savePkDuplo(this.pedido, this.pedido.codigo, this.pedido.codigoCliente)
                                                                                                                                                            .subscribe( resultadoAtualizarPedido=>{
                                                                                                                             if(resultadoAtualizarPedido){
                                                                                                                                return of(true);
                                                                                                                             }
                                                                                                                         },
                                                                                                                         error=>{
                                                                                                                           console.log(error);
                                                                                                                           this.handleError('Ocorreu um erro ao atualizar o pedido!');
                                                                                                                         }
                                                                                                                        );
                                                                                                                      }
                                                                                                                      return of(true);
                                                                                                                    }                                                                                                                 
                                                                                                                   );
                                                                          return of(true);
                                                              }                                                            
                                                            }                                                            
                                                          )
                                                       )
                                                       .subscribe(result=>{
                                                        this.itensPedidos2.splice(indexExcluir,1);
                                                        this.handlerSuccess("Item removido com sucesso!");
                                                       },
                                                       error =>{
                                                         console.log (error);
                                                         this.handleError("Ocorreu erro ao tentar remover o item.");
                                                       }
                                                         
                                                       );
      }else{
        this.itensPedidos2.splice(indexExcluir,1);
        this.valorTotal -= this.itensPedidos2[indexExcluir].valorVenda;
        this.quantidadeTotal -=this.itensPedidos2[indexExcluir].quantidade;
      }     

    }},
    "Sim", "Não"
    );
    
  }
  listaProdutoEstoque()
  {
    this.produtos = Array<Produto>();

    this.inscricaoEstoque$ = this.serviceEstoque.listaProdutosDisponiveis().subscribe(result=>{
      if (result){
        result.forEach(estoque=>{
          this.produtos.push(estoque.produto);
        })
      }
    })
  }
  preencherValorProdutoSelecionado(codigoProduto){
    this.codigoProdutoSelecionado = codigoProduto;
    this.valorCusto =0;
    this.valorProdutoSel = 0;

    let indexProduto = this.produtos.findIndex(x=>x.codigo == codigoProduto);
    this.percentualComissao = ((this.produtos[indexProduto].valorComissao / 100) + 1);     
    

    this.inscricaoEstoque$ = this.serviceEstoque.valorVenda(codigoProduto)  
                                                .pipe(concatMap(valorVendaEncontrado=>{
                                                  if (valorVendaEncontrado!= null ) {                                                   
                                                                                                        
                                                    this.valorProdutoSel = (Number(valorVendaEncontrado) * this.percentualComissao);
                                                    this.valorProdutoSel = Number(this.valorProdutoSel.toFixed(2));                                                    
 
                                                  }else{
                                                    this.handlerExclamation('Não existe estoque para este produto!');
                                                  }
                                                  return of (true);
                                                }))                                                  
                                                .subscribe(resultado=>{
                                                  this.inscricaoValorCusto$ = this.serviceEstoque.valorCusto(codigoProduto)
                                                                                                 .subscribe(valor=>{
                                                                                                    if (valor!= null){              
                                                                                                      this.valorCusto = Number(valor.toString());                                                                                        
                                                                                                      this.valorCusto = Number(this.valorCusto.toFixed(2));
                                                                                                    }
                                                                                                 })

                                                  
                                                }, 
                                                error=>{
                                                  console.log(error);
                                                  this.handleError('Ocorreu um erro ao tentar recuperar as informações do produto no estoque!')
                                                });

    
  }
  dialogBaixaPagto()
  {
    const dialogRef = this.dialog.open(PedidoBaixaPagtoComponent,
      {width: '450px' , height: '400px;',
        data : {
                  dataFechto : this.dataFechto ,
                  dataCadastro : new Date(this.dataPedido)
                }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined){
        this.dataFechto =  new Date(result);
        this.pedido.dataFechamento = new Date(result);
        this.situacao = result == undefined? "Aberto": "Fechado";
        this.submit();
      }
      
      
    });

  }
  retornar(){
    this.router.navigate(['/pedido']);
  }
  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }
  handlerExclamation(msg:string){
    this.serviceAlert.mensagemExclamation(msg);
  }
  onSubmit(): void {
      
  }
  submit() 
  {
    let codigoStatus: number = 0;
    //status
    if (this.pedido != null ){

      codigoStatus = this.dataFechto != null ? 1: 0;

      if (this.pedido.dataCancelamento == null){
        codigoStatus = 2;
      }    
    }   

    //criando o objeto que será gravado
    let pedidoGravar = this.pedido !=null ? this.pedido: { codigo : 0 , codigoCliente : this.codigoCliente} as Pedido;
    let itensPedidoGravar : Array<PedidoItem> = [];
    this.itensPedidos2.forEach( item=>{
        itensPedidoGravar.push(item);
      }      
    )
    

    pedidoGravar.codigoStatus  = codigoStatus;

    //confirmando que deseja salvar o registro.
    this.serviceAlert.openConfirmModal('Tem certeza que deseja salvar este pedido?', 'Salvar - Pedido', (answer: boolean) => 
    {
      if (!answer)
      {        
        return false;
      }
      else
      {
        let listaParaBaixaEstoque : Array<PedidoItem>=[];

        //complementando as informações
        pedidoGravar.valorTotal = this.valorTotal;
        pedidoGravar.observacao = this.formulario.get('observacao').value;
        pedidoGravar.cliente = null;
        pedidoGravar.listaPedidoItem = null;
    
        if (pedidoGravar.codigo == 0 )//alteração;
        {
          pedidoGravar.dataPedido = new Date();             
          pedidoGravar.codigoCliente = this.formulario.get('codigoCliente').value;

          this.inscricao$ = this.pedidoService.savePkDuplo(pedidoGravar, pedidoGravar.codigo, pedidoGravar.codigoCliente).pipe(concatMap(result=>{
              if (result){
                this.codigoPedido = result.codigo;
                this.pedido = result;

                if (itensPedidoGravar.length > 0){
                  itensPedidoGravar.forEach(item=>{
                    item.codigoPedido = result.codigo;
                    item.codigoCliente = result.codigoCliente;
                    item.produto = null;
                    this.inscricaoItem$ = this.pedidoItemService.save(item).subscribe(itemGravado=>{

                      if (itemGravado){
                        //adicionando a lista para baixar.                        
                        this.baixaEstoque( itemGravado.codigoProduto,itemGravado.quantidade );
                      }                      

                    },error=>{
                      console.log(error);
                      
                      //apagar registro ja criado.
                      this.inscricaoErroGravar$ = this.pedidoService.deletePkDuplo(pedidoGravar.codigoCliente, pedidoGravar.codigo).subscribe(result=>{
                        if (result){
                          this.handleError('Ocorreu um erro na gravação do Pedido e seus itens!');
                        }else{
                          console.log('rollback : Ocorreu um erro ao tentar excluir o pedido criado.')
                        }                        
                      },error=>{
                        console.log('rollback : Ocorreu um erro ao tentar excluir o pedido criado.')
                      });
                    })   
                  });            
                }
                return of(true);          
              }
            }      
          )
          ).subscribe(gravaItem =>{
            if (gravaItem)
            {
              //executar baixa de estoque
              if(!listaParaBaixaEstoque && listaParaBaixaEstoque.length > 0 ){
                listaParaBaixaEstoque.forEach(item=>{
                   
                });
              }

              this.handlerSuccess('Registro salvo com sucesso!');  
              setTimeout(() => { this.retornar(); }, 3000);      
            }
          });
        
        }      
        else //Editando o registro
        {
          this.inscricao$ = this.pedidoService
                                .savePkDuplo(pedidoGravar, pedidoGravar.codigo.toString(), pedidoGravar.codigoCliente.toString())
                                .pipe(
                                  concatMap(atualizado=>{
                                    if (atualizado != null){
                                      if (itensPedidoGravar.length > 0){
                                        itensPedidoGravar.forEach(item=>
                                          {
                                            if (item.codigo == 0)
                                            {
                                                item.codigoPedido = pedidoGravar.codigo;
                                                item.codigoCliente = pedidoGravar.codigoCliente;
                                                item.produto = null;      
      
                                                this.inscricaoItem$ = this.pedidoItemService.save(item)
                                                                                            .subscribe(gravacaoItem=>
                                                                                              {
                                                                                                if(gravacaoItem){
                                                                                                  this.listaProdutoEstoque();
                                                                                              
                                                                                                      this.baixaEstoque( item.codigoProduto,item.quantidade );
                                                                                                }                                                                                                
                                                                                              },error=>{
                                                                                                          console.log(error);
                                                                                                          this.handleError('Ocorreu um erro na gravação do itens de pedido');
                                                                                              });                                             
                                            }
                                          });
                                      }
                                    }                                                                    
                                    return of(true);  
                                  }
                                  )
                                )
                                .subscribe(result=>{
                                    if(result){                                                                            
                                      this.handlerSuccess('Registro atualizado com sucesso!');
                                      setTimeout(() => { this.retornar(); }, 3000);
                                    }
                                }, error=>{
                                  console.log(error);
                                  this.handleError('Ocorreu um erro ao tentar gravar o pedido.');
                                });
        }
      }},
     "Sim", "Não"
    );

  }

  limparCampos(){
    

    this.formulario.patchValue({
      codigoCliente :  null,
      observacao: null
    });;
    this.codigoCliente = 0;
    

  }
  baixaEstoque(codigoProduto :number, quantidade:number){
    this.inscricao$ = this.serviceEstoque.baixarEstoque(codigoProduto,quantidade)
    .subscribe(result=>{

    },error=>{
       console.log(error);
       this.handleError('Ocorreu um erro ao baixar o estoque!');                                                            
    }) ;
  }
}
