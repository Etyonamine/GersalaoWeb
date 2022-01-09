import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidoComponent } from './pedido.component';
import { PedidoFormComponent } from './pedido-form/pedido-form.component';
import { PedidoRoutingModule } from './pedido-routing.module';

@NgModule({
  declarations: [
    PedidoComponent,
    PedidoFormComponent
  ],
  imports: [
    CommonModule,
    PedidoRoutingModule
  ]
})
export class PedidoModule { }
