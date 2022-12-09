import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { environment } from 'src/environments/environment';
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
  codigoSituacao: number;
  tipoProduto: TipoProduto;
  nome: string;
  inscricao$: Subscription;
  registroJaCadastrado: boolean = false; 
  formulario: UntypedFormGroup;
  
  constructor( private formBuilder: UntypedFormBuilder,
               private tipoProdutoService: TipoProdutoService,
               private http: HttpClient,
               @Inject(MAT_DIALOG_DATA) public data: TipoProduto,
               private alertService:AlertService
               ) {
    super();
  }

  ngOnInit(): void {    
    this.tipoProduto = this.data;      
    this.titulo = this.tipoProduto.codigo !== 0 ? "Editar": "Novo";
    this.codigoSituacao = this.tipoProduto.codigo !== 0 ?  this.tipoProduto.codigoSituacao : 1;
    this.criarFormulario()
    
  }
  ngOnDestroy():void{
    if (this.inscricao$){
      this.inscricao$.unsubscribe();
    }
  }
  //criar formulario
  criarFormulario(){
    this.formulario =   this.formBuilder.group({
      nome: [this.tipoProduto.nome, Validators.required, this.isDupe("nome")],
      situacao:[this.codigoSituacao.toString(),Validators.required]
     }); 
    
  }
  
  submit(){
    this.tipoProduto.nome = this.formulario.get("nome").value;
    this.tipoProduto.codigoSituacao = this.formulario.get("situacao").value;
        
    this.inscricao$ = this.tipoProdutoService.save(this.tipoProduto).subscribe(result=>{
       
        this.handlerSuccess("Registro salvo com sucesso!");
     
    },error=>{
      console.log(error);
      this.handleError('Ocorreu um erro ao tentar salvar o arquivo.');
    });
    
  }
  handlerSuccess(msg: string) {
    this.alertService.mensagemSucesso(msg);
  }
  handleError(msg: string) {
    this.alertService.mensagemErro(msg);
  }
   // ** validar se existe*/
   isDupe(fieldName:string): AsyncValidatorFn {
    return(control:AbstractControl):Observable<{[key:string]:any}| null>=>{
      
      return this.tipoProdutoService.isDupe2(
          this.tipoProduto.codigo.toString(), 
              control.value).pipe(map(result => {
        return (result ? { isDupe: true } : null);
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
