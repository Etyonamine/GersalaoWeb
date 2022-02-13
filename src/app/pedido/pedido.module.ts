import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PedidoComponent } from './pedido.component';
import { PedidoFormComponent } from "./pedido-form/PedidoFormComponent";
import { PedidoRoutingModule } from './pedido-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PedidoItemComponent } from './pedido-item/pedido-item.component';

@NgModule({
  declarations: [
    PedidoComponent,
    PedidoFormComponent,
    PedidoItemComponent
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
