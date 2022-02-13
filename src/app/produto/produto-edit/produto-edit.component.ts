import { NumberSymbol } from '@angular/common';
import { decimalDigest } from '@angular/compiler/src/i18n/digest';
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
import { ProdutoService } from '../produto.service';

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
  inscricaoProduto$: Subscription;
  isSubmitted = false;
  valorComissaoField : string;

  constructor(
      private formBuilder:FormBuilder,
      private alertService: AlertService,
      private tipoProdutoService: TipoProdutoService,
      private linhaProdutoService:ProdutoLinhaService,
      private produtoService: ProdutoService,
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
    this.valorComissaoField =  this.data.valorComissao != null?this.data.valorComissao.toString().replace('.',','): null;

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
      nome: [(this.codigo==0?null:this.data.nome), Validators.required],
      observacao: [(this.codigo==0?null:this.data.observacao)], 
      tipo: [(this.data.codigo==0?null:this.data.codigoTipoProduto),[Validators.required]],
      linha:[(this.data.codigo==0?null:this.data.codigoLinha),Validators.required],
      codigoFornecedor:[(this.codigo==0?null:this.data.codigoFornecedor)],
      situacao : [this.codigoSituacao.toString(),Validators.required],
      valorComissao : [ this.data.valorComissao]
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
    this.isSubmitted = true;
    if (!this.formulario.valid) {
      return false;
    }
    if (this.valorComissaoField == null || this.valorComissaoField == undefined){
      this.handleError('Por favor, informe o valor de comissão do produto! Valor máximo 100%');
      return false;
    }else{
      let valorComissaoGravar = this.valorComissaoField.replace(',','.');
      if(isNaN(Number(valorComissaoGravar))){
        this.handleError('Valor de comissão informado inválido!');
        return false;
      }
      if (Number(valorComissaoGravar) > 100 || Number(valorComissaoGravar) < 0 ) 
      {
        this.handleError('Valor deve ser entre 0 a 100');
        return false;
      }

      this.valorComissaoField = valorComissaoGravar;
    }
    this.produto = {
      codigo: this.codigo,
      nome :   this.formulario.get("nome").value,
      codigoFornecedor : this.formulario.get("codigoFornecedor").value !== null ?this.formulario.get("codigoFornecedor").value:0 ,
      codigoTipoProduto : this.formulario.get("tipo").value,
      codigoSituacao : this.formulario.get("situacao").value,
      codigoLinha : this.formulario.get("linha").value,
      observacao : this.formulario.get("observacao").value,
      valorComissao : Number(this.valorComissaoField.replace(',','.'))
    } as Produto;
    
    this.inscricaoProduto$ = this.produtoService.save(this.produto).subscribe(result=>{
                              this.handlerSuccess("Registro salvado com sucesso!");
                            },error=>{
                              console.log(error);
                              this.handleError('Ocorreu erro ao salvar o registro.');
                            });

    //console.log(this.produto);


  }
  
  handlerSuccess(msg: string) {
    this.alertService.mensagemSucesso(msg);
  }

  handleError(msg: string) {
    this.alertService.mensagemErro(msg);
  }
}
