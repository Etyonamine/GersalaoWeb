import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FormaPagamento } from 'src/app/forma-pagamento/forma-pagamento';
import { FormaPagamentoService } from 'src/app/forma-pagamento/forma-pagamento.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ClienteFormaPagamento } from '../cliente-forma-pagamento';
import { ClienteFormaPagamentoDialog } from '../cliente-forma-pagamento-dialog';
import { ClienteFormaPagamentoService } from '../cliente-forma-pagamento.service';

@Component({
  selector: 'app-clienteformapagamentodialogo',
  templateUrl: './clienteformapagamentodialogo.component.html',
  styleUrls: ['./clienteformapagamentodialogo.component.scss']
})
export class ClienteformapagamentodialogoComponent implements OnInit, OnDestroy {
 
  codigoForma: number;
  titulo: string;
  formas: Array<FormaPagamento> = [];
  clienteFormaPagto: ClienteFormaPagamento;
  
  inscricao$ : Subscription;
  inscricaoClienteFormaPagto$: Subscription;

  constructor( private serviceAlert: AlertService,
               private formaPagtoService: FormaPagamentoService,
               private clienteFormaPagamentoService: ClienteFormaPagamentoService,
               @Inject(MAT_DIALOG_DATA) public data: ClienteFormaPagamentoDialog) { }

  ngOnInit(): void {
    this.listarFormasPagto();
    this.clienteFormaPagto = this.data.clienteFormaPagto;
    this.titulo = this.clienteFormaPagto.codigoFormaPagto > 0 ? "Editar":"Novo";
  }

  ngOnDestroy(): void {

    if (this.inscricao$)
    {
      this.inscricao$.unsubscribe();
    }
    if (this.inscricaoClienteFormaPagto$){
      this.inscricaoClienteFormaPagto$.unsubscribe();
    }
  }

  listarFormasPagto(){
    this.inscricao$ = this.formaPagtoService.list<FormaPagamento[]>().subscribe(result=>{
      this.formas = result;
    },
    error=>{
      console.log(error);
    });
  }

  submit(){
    if (this.clienteFormaPagto.codigoFormaPagto === 0 ){
      this.handleError('Atenção!Por favor, selecione uma forma de pagamento!');
      return false;
    }
    this.clienteFormaPagto.formaPagamento = null;
    
    this.inscricaoClienteFormaPagto$ = this.clienteFormaPagamentoService.save(this.clienteFormaPagto).subscribe(result=>{
      if (result){
        this.handlerSuccess('Forma de pagamento salvo com sucesso!');
      }
    });
   console.log(this.clienteFormaPagto);    
  }
  handleError(msg: string) {
    this.serviceAlert.mensagemErro(msg);
  }
  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }
}
