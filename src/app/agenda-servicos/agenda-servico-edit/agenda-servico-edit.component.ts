import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { AgendaServicosService } from '../agenda-servicos.service';
import { AgendaServicoEdit } from './agenda-servico-edit';

@Component({
  selector: 'app-agenda-servico-edit',
  templateUrl: './agenda-servico-edit.component.html',
  styleUrls: ['./agenda-servico-edit.component.scss']
})
export class AgendaServicoEditComponent extends BaseFormComponent implements OnInit, OnDestroy {
  formualario: FormGroup;
  servico: AgendaServicoEdit;
  
  inscricao$: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: AgendaServicoEdit,
              private formBuilder: FormBuilder,
              private agendaServicoService: AgendaServicosService,
              private alertService: AlertService) 
  {
    super();
  }
  
  ngOnInit(): void {
    this.servico = this.data;
    this.criacaoFormulario();
  }
  ngOnDestroy():void{
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
  }
  criacaoFormulario(){ 
    //formulario cliente
    this.formulario = this.formBuilder.group({                
      nomeProfissional : [{value:this.servico.nomeProfissional,disabled:true }],
      descricaoServico: [{value:this.servico.descricaoServico,disabled:true }],      
      valorServico: [{value:this.servico.valorServico,disabled:true }],
      observacao: [this.servico.observacao],      
      descricaoSituacao: [{value: this.servico.descricaoSituacao,disabled : true}]      
    });    
  }
  submit() {
    let valueSubmit = Object.assign({}, this.formulario.value);
    this.servico.observacao = valueSubmit.observacao;    
    this.inscricao$ = this.agendaServicoService.atualizarObservacao(this.servico)
                                              .subscribe(result=>{
                                                if(result){
                                                  this.handlerSucesso('Registro salvo com sucesso!'); 
                                                  setTimeout(() => {
                                                     
                                                  }, 3000);
                                                }
                                              },error=>{
                                                console.log(error);
                                                this.handleError('Ocorreu um erro ao tentar salvar o registro.');
                                              });                                        
     
  }
  handlerSucesso(mensagem:string)
  {
    this.alertService.mensagemSucesso(mensagem);
  }
  handleError(mensagem:string)
  {
    this.alertService.mensagemErro(mensagem);
  }
}
