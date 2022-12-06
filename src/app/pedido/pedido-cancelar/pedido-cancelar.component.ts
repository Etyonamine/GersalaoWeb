import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { ActivatedRoute, Router } from '@angular/router';
import { timeStamp } from 'console';
import { concat, of, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { EstoqueService } from 'src/app/estoque/estoque.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Pedido } from '../pedido';
import { PedidoItem } from '../pedido-item/pedido-item';
import { PedidoItemService } from '../pedido-item/pedido-item.service';
import { PedidoService } from '../pedido.service';

@Component({
  selector: 'app-pedido-cancelar',
  templateUrl: './pedido-cancelar.component.html',
  styleUrls: ['./pedido-cancelar.component.scss']
})
export class PedidoCancelarComponent extends BaseFormComponent implements OnInit {
  submit() {
    throw new Error('Method not implemented.');
  }

  constructor(private route: ActivatedRoute,
              private formBuilder: UntypedFormBuilder,
              private pedidoService : PedidoService, 
              private pedidoItemService: PedidoItemService,
              private estoqueService : EstoqueService,
              private alertService: AlertService,
              private router: Router) 
              { 
                super();
              }
  formulario: UntypedFormGroup;
  pedido: Pedido;

  quantidadeTotalCorrente: number;
  valorTotalCorrente: number;
  dataPedidoCorrente: string;
  numeroDoPedido: string;

  inscricao$: Subscription;
  inscricaoEstoque$:Subscription;


  ngOnInit(): void {
    
    this.pedido = this.route.snapshot.data['pedido'];
    this.quantidadeTotalCorrente = this.pedido!= null ? this.pedido.quantidadeTotal : 0;
    this.valorTotalCorrente = this.pedido!= null ? this.pedido.valorTotal : 0;
    this.dataPedidoCorrente = this.pedido!= null ? this.pedido.dataPedido.toString(): null;
    
    this.numeroDoPedido = this.pedido.numeroPedido;
    this.recuperarItens();
    this.criarFormulario();
  }
  ngOnDestroy():void{
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if (this.inscricaoEstoque$){
      this.inscricaoEstoque$.unsubscribe();
    }
  }
  criarFormulario(){
   this.formulario =  this.formBuilder.group({
      numeroPedido: [ {value : this.pedido.numeroPedido,disabled : true}],
      nomeCliente: [{value : this.pedido.nomeCliente ,disabled : true}] ,    
      dataPedido        : [{value : this.dataPedidoCorrente , disabled : true}] ,    
      quantidadeTotal : [{value : this.quantidadeTotalCorrente, disable : true}],
      valorTotal : [{value : this.valorTotalCorrente, disable : true}],
      dataFechto : [{value :  this.pedido.dataFechamento, disable : true}],
      observacao: [{value: this.pedido.observacao, disabled:true}] ,
      dataCancelamento: [{value: new Date,disabled:true}],
      motivoCancelamento: [null,Validators.required]        
    });
  }
  handlerErro(mensagem:string){
    this.alertService.mensagemErro(mensagem);
  }
  handlerSucesso(mensagem:string){
    this.alertService.mensagemSucesso(mensagem);
  }
  retornar(){
    this.router.navigate(['/pedido']);
  }
  recuperarItens(){
    let listaItem : Array<PedidoItem>=[];
    this.inscricao$ = this.pedidoItemService.listaPorPedido(this.pedido.codigo)
                                            .subscribe(result=>{
                                              this.pedido.listaPedidoItem = result;

                                            },error=>{
                                              console.log(error);
                                              this.handlerErro('Ocorreu o erro na busca de itens de pedido.');
                                            });
  }
  salvarRegistro(){
    //criar objeto de gravacao.
    let pedidoGravar = this.pedido;
    pedidoGravar.motivoCancelamento = this.formulario.get('motivoCancelamento').value;
    let hj = new Date();
    //pedidoGravar.dataCancelamento = new Date( `${hj.getFullYear()}/${("0"+(hj.getMonth())).slice(-2)}/${("0"+(hj.getDate())).slice(-2)} ${("0"+(hj.getHours())).slice(-2)}:${("0"+(hj.getMinutes())).slice(-2)}:${("0"+(hj.getSeconds())).slice(-2)} -00:00`);
    pedidoGravar.dataCancelamento = this.dataHoraAtualSemTimeZone();
    pedidoGravar.codigoStatus = 2;
    pedidoGravar.cliente = null;
    
    
    this.alertService.openConfirmModal('Tem certeza que deseja cancelar este pedido?', 'Cancelar pedido' , (answer: boolean) => {
      if (answer) {
        this.inscricao$ = this.pedidoService.save(pedidoGravar)
                                        .pipe(concatMap( resultadoSalvar=>{
                                            //atualizar estoque
                                            pedidoGravar.listaPedidoItem.forEach(item=>{
                                               this.inscricaoEstoque$ = this.estoqueService
                                                                            .adicionarQuantidadePorProduto(item.codigoProduto, item.quantidade)
                                                                            .subscribe(resultado=>{

                                                                            },error=>{
                                                                              console.log(error);
                                                                              this.handlerErro('Ocorreu erro em adicionar o produto');
                                                                              return of(false);
                                                                            });
                                            })
                                            return of(true);
                                          }
                                        ))
                                        .subscribe(result=>{
                                          if(result)
                                          {                                            
                                            this.handlerSucesso('Pedido cancelado com sucesso!');
                                            setTimeout(() => { this.retornar(); }, 3000);
                                          }
                                        },error=>{
                                          console.log (error);
                                          this.handlerErro('Ocorreu um erro ao tentar cancelar.')
                                        });
        

      }
    }, "Sim", "Não"
    );

  }
}
