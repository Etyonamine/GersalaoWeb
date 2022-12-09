import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ProdutoLinha } from '../produto-linha';
import { ProdutoLinhaService } from '../produto-linha.service';

@Component({
  selector: 'app-produto-linha-edit-dialog',
  templateUrl: './produto-linha-edit-dialog.component.html',
  styleUrls: ['./produto-linha-edit-dialog.component.scss']
})
export class ProdutoLinhaEditDialogComponent extends BaseFormComponent  implements OnInit, OnDestroy {
  
  titulo: string;
  linhaProduto: ProdutoLinha;
  inscricao$: Subscription;
  formulario: UntypedFormGroup;
  codigoSituacao: number;
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private produtoLinhaService: ProdutoLinhaService,            
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: ProdutoLinha
  ) 
  {
    super();
  }
  submit() {
    this.linhaProduto.nome = this.formulario.get("nome").value;
    this.linhaProduto.codigoSituacao = this.formulario.get("situacao").value;
        
    this.inscricao$ = this.produtoLinhaService.save(this.linhaProduto).subscribe(result=>{
       
        this.handlerSuccess("Registro salvo com sucesso!");
     
    },error=>{
      console.log(error);
      this.handleError('Ocorreu um erro ao tentar salvar o arquivo.');
    });
  }
  ngOnInit(): void {
    this.linhaProduto = this.data;
    this.titulo = this.linhaProduto.codigo == 0 ? "Novo":"Editar";
    this.codigoSituacao = this.linhaProduto.codigo == 0 ? 1: this.linhaProduto.codigoSituacao;
    this.criarFormulario();
  }
  ngOnDestroy(): void{
    if(this.inscricao$){
      this.inscricao$.unsubscribe();
    }
  }
  criarFormulario(){
    this.formulario = this.formBuilder.group({
      nome: [this.linhaProduto.nome, Validators.required, this.isDupe()],
      situacao:[this.codigoSituacao.toString(),Validators.required]
    });
  }    
  isDupe(): AsyncValidatorFn {
    return(control:AbstractControl):Observable<{[key:string]:any}| null>=>{      
      const produtoLinhaValidar = {
        codigo: this.linhaProduto.codigo,
        nome: this.formulario === undefined ? this.linhaProduto.nome:this.formulario.get('nome').value
      } as ProdutoLinha;
     
      return  this.produtoLinhaService.isDupe2(produtoLinhaValidar.codigo.toString(),produtoLinhaValidar.nome)
                  .pipe(map(result=>{
                        return (result ? {isDupe:true} : null);
      }));
    }
  }
  handlerSuccess(msg: string) {
    this.alertService.mensagemSucesso(msg);
  }
  handleError(msg: string) {
    this.alertService.mensagemErro(msg);
  }

}
