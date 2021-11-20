import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoComponent } from './produto.component';
import { ProdutoRoutingModule } from './produto-routing.module';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    ProdutoComponent
  ],
  imports: [
    CommonModule, 
    SharedModule,
    ProdutoRoutingModule
  ]
})
export class ProdutoModule { }
