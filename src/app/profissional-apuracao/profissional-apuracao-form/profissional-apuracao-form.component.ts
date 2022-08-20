import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { Subscription } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';
import { ProfissionalService } from 'src/app/profissional/profissional.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ProfissionalApuracaoPendente } from '../profissional-apuracao-pendente';

@Component({
  selector: 'app-profissional-apuracao-form',
  templateUrl: './profissional-apuracao-form.component.html',
  styleUrls: ['./profissional-apuracao-form.component.scss']
})
export class ProfissionalApuracaoFormComponent extends BaseFormComponent implements OnInit {
  
  formulario: FormGroup;
  inscricaoProfissional$: Subscription;
  minDate:Date;
  maxDate:Date;

  optionProfissionais: ProfissionalApuracaoPendente[];

  constructor(private formBuilder: FormBuilder,
              private profissionalService : ProfissionalService ,
              private alertService: AlertService) {
    super();
  }

  ngOnInit(): void {
    this.listaProfissionais();
    this.criacaoFormulario();
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth()-6);
    this.maxDate = new Date();
  }
  criacaoFormulario(){
    this.formulario = this.formBuilder.group({
      codigoProfissional: [null],
      inicioPeriodo: [null],
      fimPeriodo: [null]
    });
  }
  submit() {
    throw new Error('Method not implemented.');
  }
  listaProfissionais(){
    let inicioPeriodo  = new Date();
    inicioPeriodo.setMonth(inicioPeriodo.getMonth()-6);
    let fimPeriodo = new Date();
    this.inscricaoProfissional$ = this.profissionalService.ListarProfissionaisPendentes(inicioPeriodo, fimPeriodo)
                                                          .subscribe(result=>{
                                                            this.optionProfissionais = result;
                                                          },error=>{
                                                            console.log (error);
                                                            this.handlerError('Ocorreu um erro ao recuperar a lista de profissionais.');
                                                        });
  }
  handlerError(mensagem:string){
    this.alertService.mensagemErro(mensagem);
  }
}
