import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { ActivatedRoute, Router } from '@angular/router';
import { timeStamp } from 'console';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Pedido } from '../pedido';
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
              private formBuilder: FormBuilder,
              private pedidoService : PedidoService, 
              private alertService: AlertService,
              private router: Router) 
              { 
                super();
              }
  formulario: FormGroup;
  pedido: Pedido;

  quantidadeTotalCorrente: number;
  valorTotalCorrente: number;
  dataPedidoCorrente: string;
  numeroDoPedido: string;

  inscricao$: Subscription;



  ngOnInit(): void {
    
    this.pedido = this.route.snapshot.data['pedido'];
    this.quantidadeTotalCorrente = this.pedido!= null ? this.pedido.quantidadeTotal : 0;
    this.valorTotalCorrente = this.pedido!= null ? this.pedido.valorTotal : 0;
    this.dataPedidoCorrente = this.pedido!= null ? this.pedido.dataPedido.toString(): null;
    
    this.numeroDoPedido = this.pedido.numeroPedido;

    this.criarFormulario();
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
  salvarRegistro(){
    //criar objeto de gravacao.
    let pedidoGravar = this.pedido;
    pedidoGravar.motivoCancelamento = this.formulario.get('motivoCancelamento').value;
    pedidoGravar.dataCancelamento = new Date();
    pedidoGravar.codigoStatus = 2;
    pedidoGravar.cliente = null;
    pedidoGravar.listaPedidoItem = null;
    
    this.alertService.openConfirmModal('Tem certeza que deseja cancelar este pedido?', 'Cancelar pedido' , (answer: boolean) => {
      if (answer) {
        this.inscricao$ = this.pedidoService.savePkDuplo(pedidoGravar,pedidoGravar.codigo, pedidoGravar.codigoCliente)
                                        .subscribe(result=>{
                                          if(result!=null){
                                            this.pedido =result;
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
