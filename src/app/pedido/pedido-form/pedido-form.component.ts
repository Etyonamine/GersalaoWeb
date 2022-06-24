import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Cliente } from 'src/app/cliente/cliente';
import { ClienteService } from 'src/app/cliente/cliente.service';
import { Estoque } from 'src/app/estoque/estoque';
import { EstoqueService } from 'src/app/estoque/estoque.service';
import { ProdutoLinhaEditDialogComponent } from 'src/app/produto-linha/produto-linha-edit-dialog/produto-linha-edit-dialog.component';
import { Produto } from 'src/app/produto/produto';
import { ProdutoSemEstoque } from 'src/app/produto/produtoSemEstoque';
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
  mostraListaProduto : boolean;

  semEstoque : boolean = false;
  mensagemSemEstoque : string = '';
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
  inscricaoPedido$:Subscription;
  inscricaoItem$: Subscription;  
  inscricaoEstoque$:Subscription;
  inscricaoProduto$:Subscription;

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
    this.dataPedido = this.pedido != null?this.pedido.dataPedido.toString():this.dataHoraAtualSemTimeZone().toString();
    this.valorTotal = this.pedido != null?this.pedido.valorTotal:0;
    this.quantidadeTotal = this.pedido != null?this.pedido.quantidadeTotal:0;

    this.mostraListaProduto = false;
     

    if (this.pedido != undefined){
      
      if (this.pedido.dataCancelamento != null){
        this.situacao ="Cancelado";
      }else{
        this.situacao = this.pedido.dataFechamento != null?"Fechado":"Aberto";
      }
      
    }else{
       
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
    if (this.inscricaoPedido$){
      this.inscricaoPedido$.unsubscribe();
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
      observacao: [{value:observParam == null ?null: observParam, disabled: (this.situacao!='Aberto' )? true:false}] ,
      codigoProdutoSelecionado: [ null ]       
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

    this.mostraListaProduto = false;

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
                        this.mostraListaProduto = true;
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
    
    let codigoItem : number ;
    codigoItem = 1;
    if (this.itensPedidos2.length !== 0){
      codigoItem =  (Math.max.apply(Math, this.itensPedidos2.map(function(o) { return o.codigo; }))) + 1;
    }
    //let codigoItem  = this.itensPedidos2.length === 0 ? 1 : 
    
    
    this.itensPedidos2.push({
                            codigo : codigoItem,
                            valorCusto : this.valorCusto,
                            pedido : null,                            
                            codigoPedido : this.codigoPedido,                            
                            codigoProduto : this.codigoProdutoSelecionado,
                            quantidade : this.quantidadeProdutoSel,
                            valorVenda : this.valorProdutoSel, 
                            dataAlteracao : null,
                            dataCadastro : this.dataHoraAtualSemTimeZone(),
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

   if (this.itensPedidos2.length === 1){
    this.mostraListaProduto = true;
   }

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
      if(this.itensPedidos2[indexExcluir].codigo > 0 && this.itensPedidos2[indexExcluir].codigoPedido > 0  ){
        //excluindo o item da tabela pedido_item
        this.inscricaoDelete$ = this.pedidoItemService.excluirItem(this.itensPedidos2[indexExcluir].codigo,
                                                                   this.itensPedidos2[indexExcluir].codigoPedido)
                                                       .pipe(
                                                          concatMap(result=>{
                                                            if (result){
                                                                         /*  this.inscricaoAdicionarEstoque$ = this.serviceEstoque.adicionarQuantidadePorProduto(this.itensPedidos2[indexExcluir].codigoPedido, 
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
                                                                                                                   ); */
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

    if(indexProduto ===-1)
    {
      return ;
    }
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
                  dataFechto : new Date(this.dataPedido) ,
                  dataCadastro : new Date(this.dataPedido)
                }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined){        
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

  salvarRegistro()
  {
    let codigoStatus: number = 0;
      //confirmando que deseja salvar o registro.
      this.serviceAlert.openConfirmModal('Tem certeza que deseja salvar este pedido?', 'Salvar - Pedido', (answer: boolean) => 
      {         

        if (!answer)
        {        
          return false;
        }
        else
        {      
          //status
          if (this.pedido != null && this.pedido.dataFechamento != null  ){
            codigoStatus =  1;      
          }

          //criando o objeto que será gravado
          let pedidoGravar = this.pedido !=null ? this.pedido : { codigo : 0 , codigoCliente : this.codigoCliente} as Pedido;
          let itensPedidoGravar : Array<PedidoItem> = this.itensPedidos2;        
          

          itensPedidoGravar.forEach(item=>{          
            item.produto = null;
            item.pedido = null;                  
          });

          
          pedidoGravar.listaPedidoItem = itensPedidoGravar;//adicionando a lista de itens do pedido.
          pedidoGravar.codigoStatus  = codigoStatus;

          //complementando as informações
          pedidoGravar.valorTotal = this.valorTotal;
          pedidoGravar.observacao = this.formulario.get('observacao').value;
          pedidoGravar.cliente = null;
          pedidoGravar.listaPedidoItem = null;
      
          pedidoGravar.dataPedido = pedidoGravar.codigo === 0 ? this.dataHoraAtualSemTimeZone() : this.pedido.dataPedido;             
          pedidoGravar.codigoCliente = this.formulario.get('codigoCliente').value;
            
              //recuperando o proximo ID do pedido
          if (pedidoGravar.codigo === 0 ){
            
              this.inscricaoPedido$ = this.pedidoService.getProximoID()
                                                      .pipe(concatMap(result=>
                                                          {
                                                            pedidoGravar.codigo = result;

                                                            //gravando 
                                                            this.inscricao$  = this.pedidoService.salvarNovoRegistro(pedidoGravar)
                                                                                                .pipe(concatMap(resultadoPedido=>{
                                                                                                    this.pedido = resultadoPedido;

                                                                                                    //atribuindo o valor correto do numero do pedido
                                                                                                    itensPedidoGravar.forEach( item=>{
                                                                                                      item.codigoPedido = pedidoGravar.codigo; 
                                                                                                      item.dataCadastro = this.dataHoraAtualSemTimeZone();

                                                                                                      this.pedidoItemService.salvarNovoRegistro(item)
                                                                                                                            .subscribe(resultadoItem=>{

                                                                                                                            },error=>{                                                                                                                            
                                                                                                                              console.log(error);
                                                                                                                              return of (false);
                                                                                                                            });                                                                                                                                                                                  
                                                                                                      }                                                            
                                                                                                  );     
                                                                                                  return of (true);
                                                                                                }),
                                                                                                  concatMap(resultadoSalvarItem=>{
                                                                                                    //fazer baixa
                                                                                                    itensPedidoGravar.forEach(item=>{
                                                                                                      let estoqueBaixar = { 
                                                                                                                            codigoProduto : item.codigoProduto,
                                                                                                                            quantidadeEstoque : item.quantidade,
                                                                                                                            valorUnitario : item.valorCusto
                                                                                                                          } as Estoque;
                                                                                                      this.inscricaoEstoque$ = this.serviceEstoque
                                                                                                                                   .baixarEstoque(estoqueBaixar)
                                                                                                                                   .subscribe(result=>{

                                                                                                                                   },error=>{
                                                                                                                                    console.log(error);
                                                                                                                                    this.handleError('Erro ao executar a baixa');
                                                                                                                                    return of (false);
                                                                                                                                   });
                                                                                                    })
                                                                                                    return of (true);
                                                                                                  }))
                                                                                                .subscribe(resultado=>{
                                                                                                    return of(true);
                                                                                                    
                                                                                                  },error=>{
                                                                                                    console.log(error);
                                                                                                    this.handleError('Ocorreu um erro ao gravar o novo pedido.');
                                                                                                      //exclui o item do pedido e pedido,pois pode ter ocorrido erro de incluir algum item
                                                                                                      this.itensPedidos2.forEach(itemExcluir=>{
                                                                                                        this.inscricaoItem$ = this.pedidoItemService.delete(itemExcluir.codigo)
                                                                                                                                                    .subscribe();
                                                                                                      });
                                                                                                      
                                                                                                      this.inscricao$ = this.pedidoService.delete(pedidoGravar.codigo)
                                                                                                                                          .subscribe();
                                                                                                    
                                                                                                    return of (false);
                                                                                                  });
                                                            return of(true);
                                                          }                                                      
                                                      ))                                                      
                                                      .subscribe(resultadoFinal =>{
                                                        
                                                        if (resultadoFinal)
                                                        {
                                                          
                                                          this.handlerSuccess ('Registro salvo com sucesso!');
                                                          setTimeout(() => { this.limparCampos(); }, 3000);
                                                        }else{
                                                          
                                                          
                                                          this.handleError('Ocorreu um erro ao tentar salvar o novo registro.');
                                                        }                                                      
                                                        
                                                      },
                                                      error=>{
                                                        console.log(error);
                                                        this.handleError('Ocorreu erro ao recuperar o próximo numero de ID');
                                                        return;
                                                      });
              } 
          else
          {
            pedidoGravar.dataAlteracao = this.dataHoraAtualSemTimeZone();
            
            //atualizando o pedido
            
            this.inscricao$  = this.pedidoService.save(pedidoGravar)
                                                .pipe(concatMap(atualizaItem=>{

                                                      // atualizando os itens do pedido
                                                      itensPedidoGravar.forEach(itemAtualizar=>{
                                                          itemAtualizar.dataAlteracao = this.dataHoraAtualSemTimeZone();
                                                          
                                                          this.inscricaoItem$= this.pedidoItemService.atualizarRegistro(itemAtualizar).subscribe(result=>{},error=>{
                                                            console.error(error);
                                                            this.handleError('Ocorreu erro ao tentar atualizar o item - código = ' + itemAtualizar.codigo.toString());

                                                          })
                                                      })
                                                      return of (true);
                                                }))
                                                .subscribe(result=>{
                                                  if (result){
                                                    this.handlerSuccess ('Registro atualizado com sucesso!');
                                                    setTimeout(() => { this.retornar(); }, 3000);
                                                  }else{
                                                    this.handleError('Ocorreu um erro ao tentar atualizar o pedido ');
                                                  }
              
            },error=>{
              console.log(error);
              this.handleError('Ocorreu um erro ao gravar o novo pedido.');
            });
          }
        }
      },
      "Sim", "Não");

  }
   
  submit() 
  {   
    
    //recuperar os codigos de produtos que precisar ser verificados.
    let codigosProdutos : Array<number> = [];
    let listaProdutosSemEstoque : Array<ProdutoSemEstoque> =[];
    this.semEstoque = false;

    this.itensPedidos2.forEach(item=>{
      codigosProdutos.push(item.codigoProduto);
    })
    //validar se existe estoque.
    this.inscricaoEstoque$ = this.serviceEstoque.estoqueListaProdutosQuantidadeTotal(codigosProdutos)
                                                .pipe(concatMap(result=>{
                                                  if (result){
                                                     //valida se o estoque está disponivel
                                                    this.itensPedidos2.forEach(item=>{
                                                      let estoqueDisponivel = result.find(e=>e.codigoProduto === item.codigoProduto);

                                                      if (item.quantidade > estoqueDisponivel.quantidadeEstoque){

                                                        listaProdutosSemEstoque.push({nome : item.produto.nome , quantidadeDisponivel : estoqueDisponivel.quantidadeEstoque});
                                                        this.semEstoque = true;                                                        
                                                      }
                                                    });

                                                    if (this.semEstoque){
                                                      return of (false);
                                                    } 
                                                    return of(true);
                                                  }else{
                                                    return of (false)
                                                  }                                                  
                                                }))
                                                .subscribe( retorno=>{
                                                  if (!retorno){
                                                    if (this.semEstoque){
                                                      this.mensagemSemEstoque = 'Atenção! O(s) produto(s) : ';
                                                      listaProdutosSemEstoque.forEach(produto =>{
                                                        this.mensagemSemEstoque  += '[' + produto.nome + ' - quantidade disponivel = ' + produto.quantidadeDisponivel.toString().padStart(3,'0') +  '] ';
                                                      }
                                                      );                                                      
                                                    }else {
                                                      this.handleError('Erro ao salvar!');  
                                                    }                                                    
                                                  }else{
                                                    //this.handlerSuccess('Salvo com sucesso!');
                                                    this.salvarRegistro();
                                                  }
                                                
                                                },error=>{
                                                    console.log (error);
                                                    this.handleError('ocorreu um erro na recuperacao da lista de estoque');
                                                    }

                                                );
    
    
  }

  limparCampos(){
    this.semEstoque = false;
    this.mensagemSemEstoque = '';
    this.codigoPedido = 0;
    this.codigoCliente = 0;
    this.valorTotal = 0;
    this.quantidadeTotal = 0;
    this.itensPedidos2 =  [];    
    this.pedido = <Pedido>{codigo : 0 };    
    this.formulario.reset();    
    this.situacao = "Aberto";
    this.formulario.controls["situacao"].setValue(this.situacao);
  }

   
 
}
