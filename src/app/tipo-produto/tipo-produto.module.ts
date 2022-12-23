import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoProdutoComponent } from './tipo-produto.component';
import { TipoProdutoRoutingModule } from './tipo-produto-routing';
import { SharedModule } from './../shared/shared.module';
import { TipoProdutoDialogoComponent } from './tipo-produto-dialogo/tipo-produto-dialogo.component';
@NgModule({
  declarations: [
    TipoProdutoComponent,
    TipoProdutoDialogoComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    TipoProdutoRoutingModule,
    SharedModule
  ]
})
export class TipoProdutoModule { }
