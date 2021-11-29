import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  codigoSituacao: number;
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
      @Inject(MAT_DIALOG_DATA) public data: Produto
      ) {
    super();
   }  
  ngOnInit(): void {
    this.codigo = this.data.codigo;//codigo do produto    
    this.codigoSituacao = this.codigo ==0?1:this.data.codigoSituacao;
    this.carregarTipos();
    this.carregarLinhas();
    this.criarFormulario();
     

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
    
    this.formulario = this.formBuilder.group({
      codigo:[this.codigo],
      nome: [null, Validators.required],
      observacao: [null], 
      tipo: [this.data.codigoTipoProduto,Validators.required],
      linha:[this.data.codigoLinha,Validators.required],
      codigoFornecedor:[null],
      situacao : [this.codigoSituacao.toString(),Validators.required]
    });
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
