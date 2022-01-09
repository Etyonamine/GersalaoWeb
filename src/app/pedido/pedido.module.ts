import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidoComponent } from './pedido.component';
import { PedidoFormComponent } from './pedido-form/pedido-form.component';
import { PedidoRoutingModule } from './pedido-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PedidoComponent,
    PedidoFormComponent
  ],
  imports: [
    CommonModule,
    PedidoRoutingModule,
    SharedModule
  ]
})
export class PedidoModule { }
