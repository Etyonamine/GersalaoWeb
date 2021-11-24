import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProdutoLinha } from 'src/app/produto-linha/produto-linha';
import { ProdutoLinhaService } from 'src/app/produto-linha/produto-linha.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ApiResult } from 'src/app/shared/base.service';
import { TipoProduto } from 'src/app/tipo-produto/tipo-produto';
import { TipoProdutoService } from 'src/app/tipo-produto/tipo-produto.service';
import { Produto } from '../produto';

@Component({
  selector: 'app-produto-edit',
  templateUrl: './produto-edit.component.html',
  styleUrls: ['./produto-edit.component.scss']
})
export class ProdutoEditComponent extends BaseFormComponent implements OnInit, OnDestroy {
  
  formulario: FormGroup;
  tituloPagina: string;
  codigo: number;
  tipos: Array<TipoProduto> =[];
  linhas: Array<ProdutoLinha>=[];
  produto: Produto;
  inscricaoTipo$: Subscription;
  inscricaoLinhas$: Subscription;

  constructor(
      private formBuilder:FormBuilder,
      private alertService: AlertService,
      private tipoProdutoService: TipoProdutoService,
      private linhaProdutoService:ProdutoLinhaService,
      ) {
    super();
   }  
  ngOnInit(): void {
    this.criarFormulario();
    this.carregarTipos();
    this.carregarLinhas();
  }
  ngOnDestroy(): void{
    if(this.inscricaoTipo$){
      this.inscricaoTipo$.unsubscribe();
    }
    if(this.inscricaoLinhas$){
      this.inscricaoLinhas$.unsubscribe();
    }
  }
  criarFormulario(){
    this.formulario = this.formBuilder.group ({
      codigo:[0],
      nome: [null, [Validators.required,this.isDupe]],
      observacao: [null], 
      tipo: [0,[Validators.required]],
      linha:[0,[Validators.required]],
      codigoFornecedor:[null],
      situacao : [1,[Validators.required]]
    })
  }
  carregarTipos(){
    this.inscricaoTipo$ = this.tipoProdutoService.getData<ApiResult<TipoProduto>>(
      0,
      100,
      "nome",
      "asc",
      null,
      null
    ).subscribe(result=>{
        result.data.forEach(tipo=>{
          this.tipos.push(tipo);
        });        
            
    },error=>{
      console.log(error);
      this.handleError('Ocorreu erro ao listar os tipos');
    });
  }
  carregarLinhas(){
    this.inscricaoLinhas$ = this.linhaProdutoService.getData<ApiResult<ProdutoLinha>>(
      0,
      100,
      "nome",
      "asc",
      null,
      null
    ).subscribe(result=>{
        result.data.forEach(linha=>{
          this.linhas.push(linha);
        });        
            
    },error=>{
      console.log(error);
      this.handleError('Ocorreu erro ao listar as linhas de produto');
    });
  }
  openConfirmExclusao(){

  }
  isDupe(){

  }
  submit() {

    this.produto = {
      nome :   this.formulario.get("nome").value,
      codigoFornecedor : this.formulario.get("codigoFornecedor").value,
      codigoTipoProduto : this.formulario.get("tipo").value,
      codigoSituacao : this.formulario.get("situacao").value,
      observacao : this.formulario.get("observacao").value
    } as Produto;
 
    console.log(this.produto);


  }
  handlerSuccess(msg: string) {
    this.alertService.mensagemSucesso(msg);
  }

  handleError(msg: string) {
    this.alertService.mensagemErro(msg);
  }
}
