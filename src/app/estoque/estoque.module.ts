import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstoqueComponent } from './estoque.component';
import { SharedModule } from '../shared/shared.module';
import { EstoqueDetalheComponent } from './estoque-detalhe/estoque-detalhe.component';
import { EstoqueRoutingModule } from './estoque-routing.module';

@NgModule({
  declarations: [
    EstoqueComponent,
    EstoqueDetalheComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EstoqueRoutingModule
  ]
})
export class EstoqueModule { }
