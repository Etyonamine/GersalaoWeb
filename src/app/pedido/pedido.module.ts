import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PedidoComponent } from './pedido.component';
import { PedidoRoutingModule } from './pedido-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PedidoItemComponent } from './pedido-item/pedido-item.component';
import { PedidoFormComponent } from './pedido-form/pedido-form.component';
import { PedidoBaixaPagtoComponent } from './pedido-baixa-pagto/pedido-baixa-pagto.component';

@NgModule({
  declarations: [
    PedidoComponent,
    PedidoFormComponent,    
    PedidoItemComponent, PedidoBaixaPagtoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PedidoRoutingModule,
    SharedModule
  ]
})
export class PedidoModule { }
