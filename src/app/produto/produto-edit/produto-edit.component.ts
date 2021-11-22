import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProdutoLinha } from 'src/app/produto-linha/produto-linha';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { TipoProduto } from 'src/app/tipo-produto/tipo-produto';
import { Produto } from '../produto';

@Component({
  selector: 'app-produto-edit',
  templateUrl: './produto-edit.component.html',
  styleUrls: ['./produto-edit.component.scss']
})
export class ProdutoEditComponent extends BaseFormComponent implements OnInit {
  submit() {
    throw new Error('Method not implemented.');
  }
  formulario: FormGroup;
  tituloPagina: string;
  codigo: number;
  tipos: Array<TipoProduto>=[];
  linhas: Array<ProdutoLinha>=[];

  constructor(
      private formBuilder:FormBuilder,
      private alertService: AlertService,
      ) {
    super();
   }  
  ngOnInit(): void {
    this.criarFormulario();
  }
  criarFormulario(){
    this.formulario = this.formBuilder.group ({
      codigo:[0],
      nome: [null, [Validators.required,this.isDupe]],
      observacao: [null], 
      tipo: [0,[Validators.required]],
      linha:[0,[Validators.required]],
      situacao : [1,[Validators.required]]
    })
  }
 

  openConfirmExclusao(){

  }
  isDupe(){

  }
}
