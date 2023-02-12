import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';

@Component({
  selector: 'app-caixa-abrir',
  templateUrl: './caixa-abrir.component.html',
  styleUrls: ['./caixa-abrir.component.scss']
})
export class CaixaAbrirComponent extends BaseFormComponent implements OnInit {
  
  dataCorrente: Date;
  formulario: FormGroup;
    
  constructor(private formBuilder: FormBuilder,
              private alertService:AlertService,
              private router: Router, ) {
    super();
  }
  ngOnInit(): void {
   this.dataCorrente = new Date();  
   this.criacaoFormulario();
  }
  criacaoFormulario() {
    this.formulario = this.formBuilder.group({
      dataCorrente: [this.dataCorrente.toLocaleString()],
      valorInicial:[0, Validators.required],
      observacao:[null]
    });
  }   
  handleError(msg:string){
    this.alertService.mensagemErro(msg);
  }  
  handleSucesso(msg:string){
    this.alertService.mensagemSucesso(msg);
  }  
  retornar(){
    this.router.navigate(['/caixa']);
  }
  submit() {
    this.handleSucesso('Salvo com sucesso!');
  }

}
