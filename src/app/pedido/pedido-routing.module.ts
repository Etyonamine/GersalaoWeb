import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PedidoComponent } from './pedido.component';
import { PedidoResolveGuard } from './guard/pedido-resolver.guard';
import { PedidoFormComponent } from './pedido-form/pedido-form.component';



const pedidoRoutes: Routes = [
  {path:'', component: PedidoComponent},
  {path:'pedido-form',
      component:PedidoFormComponent},
      {
        path:':codigo',
        component:PedidoFormComponent,
        resolve:{
          estoques: PedidoResolveGuard
      }
  }
    
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(pedidoRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PedidoRoutingModule { }
