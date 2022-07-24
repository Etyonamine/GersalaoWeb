import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';

import { ProfissionalService } from '../profissional.service';
import { ProfissionalFinanceiro } from './profissional-financeiro';

@Component({
  selector: 'app-profissional-financeiro',
  templateUrl: './profissional-financeiro.component.html',
  styleUrls: ['./profissional-financeiro.component.scss']
})
export class ProfissionalFinanceiroComponent extends BaseFormComponent implements OnInit,OnDestroy {

  formulario: FormGroup;
  codigoProfissional: number;
  codigoUsuario: number;
  valorComissao: string;

  inscricao$: Subscription ;


  submit() {
    let valorComissaoSalvar = Number.parseFloat(this.formulario.get('valorComissao').value);
    this.inscricao$ = this.profisssionalService.AtualizarValorComissao(valorComissaoSalvar, this.codigoProfissional)
                                              .subscribe(result=>{
                                                if (!result){
                                                  this.handlerError('O valor da comissão não foi atualizado!Por favor,verificar.');                                                
                                                }
                                                this.handlerSucesso('O valor da comissão foi salva com sucesso!');
                                                setTimeout(() => {
                                                  this.retonar();
                                                }, 3000);
                                              },error=>{
                                                console.log(error);
                                                this.handlerError('Ocorreu um erro ao tentar atualizar a comissão.');
                                              });
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProfissionalFinanceiro,
              public dialogRef: MatDialogRef<ProfissionalFinanceiroComponent>,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private profisssionalService: ProfissionalService,
              private router: Router
              ) {
     super(); 
  }

  ngOnInit(): void {

    this.codigoProfissional = this.data.codigoProfissional;
    this.codigoUsuario = this.data.codigoUsuario;     
    this.valorComissao = this.data.valorComissao.toFixed(2);

    this.criarFormulario();
  }
  ngOnDestroy(): void{
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
  }
  criarFormulario(){
    this.formulario = this.formBuilder.group({  
      valorComissao : [this.valorComissao, Validators.required]
    });
  }
  
  allowNumericDigitsOnlyOnKeyUp(e) {		
		const charCode = e.which ? e.which : e.keyCode;
		if (charCode !== 190 && charCode !== 46 && charCode!==44){
      if (charCode > 31  && (charCode < 48 || charCode > 57)) {
        this.handlerError("Por favor, informar apenas numeros e casas decimais");        
      }
    }	 
	}

  handlerError (mensagem: string){
    return this.alertService.mensagemErro(mensagem);
  }

  handlerSucesso (mensagem: string){
    return this.alertService.mensagemSucesso(mensagem);
  }
  setTwoNumberDecimal($event){
    return this.formatarNumeroComVirgula($event);
  }
  retonar(){
    this.dialogRef.close(this.formulario.get("valorComissao").value);
  }
   
}
