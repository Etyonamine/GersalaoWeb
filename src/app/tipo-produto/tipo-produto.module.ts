import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoProdutoComponent } from './tipo-produto.component';
import { TipoProdutoRoutingModule } from './tipo-produto-routing';

@NgModule({
  declarations: [
    TipoProdutoComponent
  ],
  imports: [
    CommonModule,
    TipoProdutoRoutingModule
  ]
})
export class TipoProdutoModule { }
