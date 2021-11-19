import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { TipoProduto } from '../tipo-produto';
import { TipoProdutoService } from '../tipo-produto.service';

@Component({
  selector: 'app-tipo-produto-dialogo',
  templateUrl: './tipo-produto-dialogo.component.html',
  styleUrls: ['./tipo-produto-dialogo.component.scss']
})
export class TipoProdutoDialogoComponent extends BaseFormComponent implements OnInit, OnDestroy {

  titulo: string;
  codigo: number;
  tipoProduto: TipoProduto;
  nome: string;
  inscricao$: Subscription;
  registroJaCadastrado: boolean = false; 
  formulario: FormGroup;
  
  constructor( private formBuilder: FormBuilder,
               private tipoProdutoService: TipoProdutoService,
               @Inject(MAT_DIALOG_DATA) public data: TipoProduto,
               private alertService:AlertService
               ) {
    super();
  }

  ngOnInit(): void {    
    this.tipoProduto = this.data;
    this.nome = this.tipoProduto.nome;
    this.codigo = this.data.codigo;
    this.titulo = this.data.codigo !== 0 ? "Editar": "Novo";
    this.criarFormulario()
  }
  ngOnDestroy():void{
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
  }
  //criar formulario
  criarFormulario(){
    this.formulario = new FormGroup({
      nome: new FormControl(this.nome === undefined ? null : this.nome, Validators.required)
    },null, this.isDupe());  
  }
  
  submit(){
    this.nome = this.formulario.get("nome").value;

    if (this.nome ==='' || this.nome === undefined){
      this.handleError('Por favor, digite um nome!');
      return false;
    }    
  }
  handlerSuccess(msg: string) {
    this.alertService.mensagemSucesso(msg);
  }
  handleError(msg: string) {
    this.alertService.mensagemErro(msg);
  }
   // ** validar se existe*/
   isDupe(): AsyncValidatorFn {
    return(control:AbstractControl):Observable<{[key:string]:any}| null>=>{
      var tipoProduto = <TipoProduto>{};
      tipoProduto.codigo = (this.codigo)?this.codigo:0;
      tipoProduto.nome = this.formulario.get("nome").value;

      return this.tipoProdutoService.isDupe(tipoProduto).pipe(map(result=>{
        return (result ? {isDupe:true} : null);
      }));
    }
/* 
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      // verificando se é um caso de ediçao ou novo registro
      const tipoProdutoValidar = (this.codigo) ? this.tipoProduto :  {} as TipoProduto;

      tipoProdutoValidar.codigo = this.codigo;
      tipoProdutoValidar.nome = this.formulario.get('nome').value;

      return this.tipoProdutoService.isDupe(tipoProdutoValidar).pipe(map(result => {
        return (result ? { isDupe: true } : null);
      }));
    }; */
  }

}
