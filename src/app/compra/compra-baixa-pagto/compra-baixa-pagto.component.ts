import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Compra } from '../compra';
import { CompraServiceService } from '../compra-service.service';
import { DialogDataBaixaPagto } from '../compra.component';

@Component({
  selector: 'app-compra-baixa-pagto',
  templateUrl: './compra-baixa-pagto.component.html',
  styleUrls: ['./compra-baixa-pagto.component.scss']
})
export class CompraBaixaPagtoComponent extends BaseFormComponent implements OnInit {
  
  codigo : number;
  dataCompra : Date;
  dataBoleto : Date;
  valorTotal : number;
  dataPagto : Date;
  dataHoje : Date;
  
  atualizadoDataPagto: boolean = false;

  formulario: UntypedFormGroup;

  inscricao$: Subscription;

  constructor( 
              @Inject(MAT_DIALOG_DATA) public data: DialogDataBaixaPagto,
              private formBuilder: UntypedFormBuilder,
              private compraService: CompraServiceService,
              private serviceAlert: AlertService) {
    super();
   }

  ngOnInit(): void {
    this.codigo = this.data.codigoCompra;
    this.dataCompra = this.data.dataCompra;
    this.dataBoleto = this.data.dataBoleto;
    this.valorTotal = this.data.valorTotal;
    this.dataHoje = new Date();
    this.criarFormulario();
  }
  criarFormulario(){
    this.formulario = this.formBuilder.group({
      dataPagtoBoletoSelecionado: [null, Validators.required]
    });
  }

  ngOnDestroy():void{
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
  }
  submit() {
    let compra = {codigo : this.codigo, dataPagtoBoleto : this.formulario.get('dataPagtoBoletoSelecionado').value} as Compra;

    this.inscricao$ = this.compraService.baixaPagto(compra).subscribe(result=>{
      this.handlerSuccess('Baixa efetuado com sucesso!'); 
      this.atualizadoDataPagto = true;     
    },
    error=>{
      this.handleError('Ocorreu um erro ao tentar executar a baixa de pagamento.');
      console.log(error);
    });
    
  
  }
  handleError(msg:string)
    {
      this.serviceAlert.mensagemErro(msg);
    }
  handlerSuccess(msg: string) {
    this.serviceAlert.mensagemSucesso(msg);
  }
  
}
