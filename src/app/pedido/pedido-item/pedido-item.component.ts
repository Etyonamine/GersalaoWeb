import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Cliente } from 'src/app/cliente/cliente';
import { ClienteService } from 'src/app/cliente/cliente.service';
import { Produto } from 'src/app/produto/produto';
import { ProdutoService } from 'src/app/produto/produto.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
export interface DialogPedidoItem {    
  codigoCliente: number;
  codigoPedido: number;
  
}
@Component({
  selector: 'app-pedido-item',
  templateUrl: './pedido-item.component.html',
  styleUrls: ['./pedido-item.component.scss']
})
export class PedidoItemComponent extends BaseFormComponent implements OnInit, OnDestroy {
  formulario: FormGroup;
  nomeCliente : string ;
  codigoCliente : number;
  codigoPedido : number;
  codigoPedidoItem : number;
  codigoProduto :number;

  inscricao$ : Subscription;
  inscricaoProduto$ : Subscription;

  cliente : Cliente;
  produtos: Array<Produto>;

  constructor(
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: DialogPedidoItem,
        private clienteService : ClienteService,
        private produtoService : ProdutoService
        ) { super(); }

  ngOnInit(): void {
      
      this.codigoCliente = this.data.codigoCliente;
      this.codigoPedido = this.data.codigoPedido;
      this.getCliente();      
      //this.nomeCliente = this.cliente.nome;
      this.criarFormulario();
      this.getListaProdutos();
  }

  ngOnDestroy():void {
    if(this.inscricao$){
      this.inscricao$.unsubscribe();
    }
    if(this.inscricaoProduto$){
      this.inscricaoProduto$.unsubscribe();
    }
  }
  criarFormulario(){
    this.formulario = this.formBuilder.group({
      codigoProduto: [this.codigoProduto]       
    });
  }

  //recuperar a informação do cliente
  getCliente(){
    this.inscricao$ = this.clienteService.get<Cliente>(this.codigoCliente)
                                         .subscribe(result=>{
                                            this.cliente = result;
                                            this.nomeCliente = this.cliente.nome;
                                         })
  }
  getListaProdutos(){
    this.inscricaoProduto$ = this.produtoService.ListarTodos()
                                                .subscribe(
                                                  result=>{
                                                    this.produtos = result;                                                    
                                                  }
                                                );

  }
  submit() {
    
  }
}
