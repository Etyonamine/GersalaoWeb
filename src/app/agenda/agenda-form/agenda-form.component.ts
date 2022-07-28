import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Profissional } from 'src/app/profissional/professional';
import { ProfissionalService } from 'src/app/profissional/profissional.service';
import { Servico } from 'src/app/servico/servico';
import { ServicosService } from 'src/app/servico/servicos.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Agenda } from '../agenda';

@Component({
  selector: 'app-agenda-form',
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.scss']
})
export class AgendaFormComponent extends BaseFormComponent implements OnInit {
  formulario: FormGroup;
  agenda: Agenda;
  dataSelecionado : string;
  optionProfissional: Array<Profissional>=[];
  optionServicos: Array<Servico>=[];

  submit() {
    throw new Error('Method not implemented.');
  }

  constructor(private formBuilder: FormBuilder, 
             private alertService: AlertService,
             private profissionalService: ProfissionalService,
             private servicoService: ServicosService,
             private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {

    this.dataSelecionado ='28/07/2022';
    this.criacaoFormulario();
    this.optionProfissional = [];
    this.optionServicos = [];
  }
  criacaoFormulario(){
    
    //formulario cliente
    this.formulario = this.formBuilder.group({
      dataSelecionado: [{value: this.dataSelecionado, disabled: true}, Validators.required],
      horaInicio: [null, Validators.required],
      horaFim: [null, Validators.required],
      codigoProfissional:[null, Validators.required]
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
